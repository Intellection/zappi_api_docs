// Generates the request example for every language from one request definition,
// so the samples can't drift apart.

export const BASE_URL = "https://api.zappi.io/v1";
export const TOKEN = "YOUR_ACCESS_TOKEN";
export const INSTALLATION = "YOUR_INSTALLATION_UUID";
export const CLIENT_ID = "YOUR_CLIENT_ID";
export const CLIENT_SECRET = "YOUR_CLIENT_SECRET";

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export type RequestExample = {
  method: "GET" | "POST" | "DELETE";
  path: string;
  auth?: "bearer" | "basic";
  query?: Record<string, string>;
  body?: Json;
};

export type Language = { id: string; label: string; shiki: string };

export const LANGUAGES: Language[] = [
  { id: "curl", label: "cURL", shiki: "bash" },
  { id: "node", label: "Node.js", shiki: "javascript" },
  { id: "python", label: "Python", shiki: "python" },
  { id: "ruby", label: "Ruby", shiki: "ruby" },
  { id: "php", label: "PHP", shiki: "php" },
  { id: "go", label: "Go", shiki: "go" },
  { id: "java", label: "Java", shiki: "java" },
  { id: "csharp", label: "C#", shiki: "csharp" },
];

type Prepared = {
  method: RequestExample["method"];
  url: string;
  headers: [string, string][];
  basic: boolean;
  json?: string;
  body?: Json;
};

function prepare(req: RequestExample): Prepared {
  const query = req.query ? `?${new URLSearchParams(req.query)}` : "";
  const basic = req.auth === "basic";
  const headers: [string, string][] = basic
    ? []
    : [
        ["Authorization", `Bearer ${TOKEN}`],
        ["X-Zappi-Installation", INSTALLATION],
      ];
  if (req.body !== undefined) headers.push(["Content-Type", "application/json"]);

  return {
    method: req.method,
    url: `${BASE_URL}${req.path}${query}`,
    headers,
    basic,
    json: req.body === undefined ? undefined : JSON.stringify(req.body, null, 2),
    body: req.body,
  };
}

const indent = (text: string, pad: string) =>
  text
    .split("\n")
    .map((line, i) => (i === 0 ? line : pad + line))
    .join("\n");

const titleCase = (method: string) => method[0] + method.slice(1).toLowerCase();

// cURL builds the query string with -G so the parameters stay readable
function curl(r: Prepared, query?: Record<string, string>): string {
  const url = query ? r.url.split("?")[0] : r.url;
  const lines = [r.method === "GET" ? `curl ${query ? "-G " : ""}${url}` : `curl -X ${r.method} ${url}`];
  if (r.basic) lines.push(`-u ${CLIENT_ID}:${CLIENT_SECRET}`);
  for (const [name, value] of r.headers) lines.push(`-H "${name}: ${value}"`);
  for (const [name, value] of Object.entries(query ?? {})) lines.push(`--data-urlencode "${name}=${value}"`);
  if (r.json) lines.push(`-d '${indent(r.json.replaceAll("'", "'\\''"), "  ")}'`);
  return lines.map((line, i) => (i === 0 ? line : `  ${line}`)).join(" \\\n");
}

function node(r: Prepared): string {
  const headers = r.basic
    ? [`Authorization: \`Basic \${Buffer.from("${CLIENT_ID}:${CLIENT_SECRET}").toString("base64")}\`,`]
    : r.headers.map(([name, value]) => `"${name}": "${value}",`);
  const options = [`method: "${r.method}",`, "headers: {", ...headers.map((h) => `  ${h}`), "},"];
  if (r.json) options.push(`body: JSON.stringify(${indent(r.json, "  ")}),`);

  return [
    `const response = await fetch("${r.url}", {`,
    ...options.map((o) => `  ${o}`),
    "});",
    "",
    "console.log(await response.json());",
  ].join("\n");
}

function python(r: Prepared): string {
  const call = [`"${r.url}"`];
  if (r.basic) call.push(`auth=("${CLIENT_ID}", "${CLIENT_SECRET}")`);
  else {
    const headers = r.headers
      .filter(([name]) => name !== "Content-Type")
      .map(([name, value]) => `    "${name}": "${value}",`);
    call.push(["headers={", ...headers, "}"].join("\n"));
  }
  if (r.body !== undefined) call.push(`json=${pythonLiteral(r.body, 0)}`);

  return [
    "import requests",
    "",
    `response = requests.${r.method.toLowerCase()}(`,
    ...call.map((arg) => `    ${indent(arg, "    ")},`),
    ")",
    "",
    "print(response.json())",
  ].join("\n");
}

function pythonLiteral(value: Json, depth: number): string {
  const pad = "    ".repeat(depth + 1);
  const close = "    ".repeat(depth);
  if (value === null) return "None";
  if (value === true) return "True";
  if (value === false) return "False";
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return `[\n${value.map((v) => `${pad}${pythonLiteral(v, depth + 1)},`).join("\n")}\n${close}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    return `{\n${entries.map(([k, v]) => `${pad}"${k}": ${pythonLiteral(v, depth + 1)},`).join("\n")}\n${close}}`;
  }
  return JSON.stringify(value);
}

function ruby(r: Prepared): string {
  const lines = [
    'require "net/http"',
    'require "json"',
    "",
    `uri = URI("${r.url}")`,
    `request = Net::HTTP::${titleCase(r.method)}.new(uri)`,
  ];
  if (r.basic) lines.push(`request.basic_auth("${CLIENT_ID}", "${CLIENT_SECRET}")`);
  for (const [name, value] of r.headers) lines.push(`request["${name}"] = "${value}"`);
  if (r.json) lines.push(`request.body = <<~JSON\n${indent(r.json, "  ").replace(/^/, "  ")}\nJSON`);

  return [
    ...lines,
    "",
    "response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|",
    "  http.request(request)",
    "end",
    "",
    "puts JSON.parse(response.body)",
  ].join("\n");
}

function php(r: Prepared): string {
  const options: string[] = [];
  if (r.basic) options.push(`'auth' => ['${CLIENT_ID}', '${CLIENT_SECRET}'],`);
  else {
    const headers = r.headers
      .filter(([name]) => name !== "Content-Type")
      .map(([name, value]) => `    '${name}' => '${value}',`);
    options.push(["'headers' => [", ...headers, "],"].join("\n"));
  }
  if (r.body !== undefined) options.push(`'json' => ${phpLiteral(r.body, 0)},`);

  return [
    "<?php",
    "require 'vendor/autoload.php';",
    "",
    "$client = new \\GuzzleHttp\\Client();",
    "",
    `$response = $client->request('${r.method}', '${r.url}', [`,
    ...options.map((o) => `    ${indent(o, "    ")}`),
    "]);",
    "",
    "echo $response->getBody();",
  ].join("\n");
}

function phpLiteral(value: Json, depth: number): string {
  const pad = "    ".repeat(depth + 1);
  const close = "    ".repeat(depth);
  if (value === null) return "null";
  if (typeof value === "boolean") return String(value);
  if (typeof value === "string") return `'${value.replaceAll("'", "\\'")}'`;
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return `[\n${value.map((v) => `${pad}${phpLiteral(v, depth + 1)},`).join("\n")}\n${close}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "[]";
    return `[\n${entries.map(([k, v]) => `${pad}'${k}' => ${phpLiteral(v, depth + 1)},`).join("\n")}\n${close}]`;
  }
  return String(value);
}

function go(r: Prepared): string {
  const imports = ['"fmt"', '"io"', '"net/http"', ...(r.json ? ['"strings"'] : [])].sort();
  const body = r.json ? `strings.NewReader(\`${r.json}\`)` : "nil";
  const lines = [`req, _ := http.NewRequest("${r.method}", "${r.url}", ${body})`];
  if (r.basic) lines.push(`req.SetBasicAuth("${CLIENT_ID}", "${CLIENT_SECRET}")`);
  for (const [name, value] of r.headers) lines.push(`req.Header.Set("${name}", "${value}")`);

  return [
    "package main",
    "",
    "import (",
    ...imports.map((i) => `\t${i}`),
    ")",
    "",
    "func main() {",
    ...lines.map((l) => `\t${indent(l, "")}`),
    "",
    "\tres, err := http.DefaultClient.Do(req)",
    "\tif err != nil {",
    "\t\tpanic(err)",
    "\t}",
    "\tdefer res.Body.Close()",
    "",
    "\tbody, _ := io.ReadAll(res.Body)",
    "\tfmt.Println(string(body))",
    "}",
  ].join("\n");
}

function java(r: Prepared): string {
  const builder = [`.uri(URI.create("${r.url}"))`];
  if (r.basic) {
    builder.push(
      `.header("Authorization", "Basic " + Base64.getEncoder().encodeToString("${CLIENT_ID}:${CLIENT_SECRET}".getBytes()))`,
    );
  }
  for (const [name, value] of r.headers) builder.push(`.header("${name}", "${value}")`);
  const publisher = r.json
    ? `HttpRequest.BodyPublishers.ofString("""\n${r.json}""")`
    : "HttpRequest.BodyPublishers.noBody()";
  builder.push(`.method("${r.method}", ${indent(publisher, "    ")})`, ".build();");

  return [
    "import java.net.URI;",
    "import java.net.http.HttpClient;",
    "import java.net.http.HttpRequest;",
    "import java.net.http.HttpResponse;",
    ...(r.basic ? ["import java.util.Base64;"] : []),
    "",
    "HttpRequest request = HttpRequest.newBuilder()",
    ...builder.map((b) => `    ${indent(b, "    ")}`),
    "",
    "HttpResponse<String> response = HttpClient.newHttpClient()",
    "    .send(request, HttpResponse.BodyHandlers.ofString());",
    "System.out.println(response.body());",
  ].join("\n");
}

function csharp(r: Prepared): string {
  const lines = [
    "using System.Net.Http.Headers;",
    ...(r.basic ? ["using System.Text;"] : []),
    "",
    "var client = new HttpClient();",
    `var request = new HttpRequestMessage(HttpMethod.${titleCase(r.method)}, "${r.url}");`,
  ];
  if (r.basic) {
    lines.push(
      `var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes("${CLIENT_ID}:${CLIENT_SECRET}"));`,
      'request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);',
    );
  }
  for (const [name, value] of r.headers.filter(([name]) => name !== "Content-Type")) {
    lines.push(
      name === "Authorization"
        ? `request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", "${TOKEN}");`
        : `request.Headers.Add("${name}", "${value}");`,
    );
  }
  if (r.json) {
    lines.push(`request.Content = new StringContent("""\n${r.json}\n""", Encoding.UTF8, "application/json");`);
    if (!r.basic) lines.splice(1, 0, "using System.Text;");
  }

  return [
    ...lines,
    "",
    "var response = await client.SendAsync(request);",
    "Console.WriteLine(await response.Content.ReadAsStringAsync());",
  ].join("\n");
}

const generators: Record<string, (r: Prepared, query?: Record<string, string>) => string> = {
  curl,
  node,
  python,
  ruby,
  php,
  go,
  java,
  csharp,
};

export function snippets(req: RequestExample): { language: Language; code: string }[] {
  const prepared = prepare(req);
  return LANGUAGES.map((language) => ({ language, code: generators[language.id](prepared, req.query) }));
}
