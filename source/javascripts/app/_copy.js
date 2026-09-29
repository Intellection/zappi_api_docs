var COPY_ICON = '<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.88a1.5 1.5 0 0 1 1.06.44l3.12 3.12A1.5 1.5 0 0 1 17 6.62v6.88A1.5 1.5 0 0 1 15.5 15H14v-3.38a3 3 0 0 0-.88-2.12L9.88 6.26A3 3 0 0 0 7.76 5.38H7V3.5Z"></path><path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.88a1.5 1.5 0 0 0-.44-1.06L9.44 6.44A1.5 1.5 0 0 0 8.38 6H4.5Z"></path></svg>';

function copyToClipboard(container) {
  var text = container.textContent.replace(/\n$/, '');
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
    return;
  }
  var el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

function copyButton() {
  return $('<button type="button" class="copy-clipboard">' + COPY_ICON + '<span>Copy</span></button>');
}

function showCopied($button) {
  var $label = $button.find('span');
  $label.text('Copied');
  clearTimeout($button.data('timer'));
  $button.data('timer', setTimeout(function() { $label.text('Copy'); }, 1500));
}

// Each "> Example Request:" label gets one Copy button, which copies whichever
// code block below it is visible for the selected language. Code blocks with
// no label get the button inside the block instead.
function setupCodeCopy() {
  $('.content > blockquote.code-label').each(function() {
    var $label = $(this);
    var $blocks = $label.nextUntil(':not(div.highlight)');
    if ($blocks.length === 0) return;

    var $button = copyButton();
    $label.children('p').append($button);
    $button.on('click', function() {
      copyToClipboard($blocks.children('pre:visible').first().children('code').get(0));
      showCopied($button);
    });
  });

  $('.content > div.highlight').each(function() {
    var $wrapper = $(this);
    var $run = $wrapper.prevUntil(':not(div.highlight)').addBack();
    if ($run.first().prev().is('blockquote.code-label')) return;

    var $block = $wrapper.children('pre');
    var $button = copyButton().addClass('copy-clipboard-inline');
    $block.prepend($button);
    $button.on('click', function() {
      copyToClipboard($block.children('code').get(0));
      showCopied($button);
    });
  });
}
