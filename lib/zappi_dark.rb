# -*- coding: utf-8 -*- #
# frozen_string_literal: true

# Syntax colours for the code panel, taken from the Zappi Design System.
# No background is set here: the code block background comes from screen.css.

module Rouge
  module Themes
    class ZappiDark < CSSTheme
      name 'zappi.dark'

      palette :white     => '#ffffff'
      palette :grey      => '#818181' # mine shaft 500
      palette :pink      => '#FF9FB4' # guava 300
      palette :green     => '#9BDA9B' # fern 300
      palette :blue      => '#81C7FF' # blueberry 300
      palette :yellow    => '#FFE746' # mango 300
      palette :red       => '#DB4A46' # valencia 500

      style Text,
            Text::Whitespace,
            Name,
            Punctuation,
            Operator,
            Literal::String::Escape,          :fg => :white
      style Comment,
            Comment::Multiline,
            Comment::Preproc,
            Comment::Single,
            Comment::Special,
            Generic::Output,
            Generic::Prompt,                  :fg => :grey
      style Error,
            Generic::Error,
            Generic::Traceback,               :fg => :red
      style Name::Tag,
            Name::Label,
            Name::Attribute,                  :fg => :pink
      style Literal::String,
            Literal::String::Backtick,
            Literal::String::Char,
            Literal::String::Doc,
            Literal::String::Double,
            Literal::String::Heredoc,
            Literal::String::Interpol,
            Literal::String::Other,
            Literal::String::Single,
            Literal::String::Symbol,          :fg => :green
      style Literal::Number,
            Literal::Number::Float,
            Literal::Number::Hex,
            Literal::Number::Integer,
            Literal::Number::Integer::Long,
            Literal::Number::Oct,             :fg => :blue
      style Keyword,
            Keyword::Constant,
            Keyword::Declaration,
            Keyword::Namespace,
            Keyword::Pseudo,
            Keyword::Reserved,
            Keyword::Type,
            Name::Builtin,                    :fg => :yellow
    end
  end
end
