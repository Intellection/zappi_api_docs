require 'nokogiri'

# Post-processes the rendered page HTML before it goes into the layout.
#
# eyebrows maps an eyebrow label to the h1 titles it sits above, as set in the
# page front matter. Each matching h1 gets a data-eyebrow attribute, which the
# stylesheet shows above the title.
#
# Code sample labels are the "> Example Request:" blockquotes. A trailing
# status such as "> Example Response: 200 OK" is split out into a status pill.
def decorate_page(page_content, eyebrows)
  html_doc = Nokogiri::HTML::DocumentFragment.parse(page_content)

  groups = {}
  (eyebrows || {}).each do |label, titles|
    Array(titles).each { |title| groups[title.to_s] = label.to_s }
  end

  html_doc.css('h1').each do |h1|
    label = groups[h1.text.strip]
    h1['data-eyebrow'] = label if label
  end

  html_doc.css('blockquote').each do |quote|
    paragraphs = quote.css('p')
    next unless paragraphs.length == 1

    text = paragraphs.first.text.strip
    label, status = text.match(/\A(.*?):\s*(\d{3}\b.*)\z/)&.captures
    label ||= text.sub(/:\z/, '')

    quote['class'] = 'code-label'
    paragraphs.first.inner_html = ''
    paragraphs.first.add_child(Nokogiri::XML::Node.new('span', html_doc).tap do |span|
      span['class'] = 'code-label-text'
      span.content = label
    end)
    next unless status

    paragraphs.first.add_child(Nokogiri::XML::Node.new('span', html_doc).tap do |span|
      span['class'] = "status status-#{status[0]}xx"
      span.content = status
    end)
  end

  html_doc.to_html
end
