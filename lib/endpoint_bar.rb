# Renders an endpoint bar (method badge plus path) from a fenced block:
#
#   ```endpoint
#   POST /public_integrations/authorize
#   ```
#
# The output is a plain div rather than a highlighted code block, so it stays
# in the content column instead of floating into the code panel.
require 'cgi'

module EndpointBar
  def block_code(code, full_lang_name)
    return super unless full_lang_name == 'endpoint'

    method, path = code.strip.split(/\s+/, 2)
    method = method.to_s.upcase

    "<div class=\"endpoint\">" \
      "<span class=\"endpoint-method endpoint-method-#{method.downcase}\">#{CGI.escapeHTML(method)}</span>" \
      "<code class=\"endpoint-path\">#{CGI.escapeHTML(path.to_s)}</code>" \
    "</div>"
  end
end

require 'middleman-core/renderers/redcarpet'
Middleman::Renderers::MiddlemanRedcarpetHTML.send :include, EndpointBar
