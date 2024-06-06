Comments
========

Pine Script supports single-line comments. Any text from the symbol
``//`` until the end of the line is considered as comment. An example::

    //@version=4
    study("Test")
    // This line is a comment
    a = close // This is also a comment
    plot(a)

The *Pine Editor* has a hotkey for commenting/uncommenting:
``Ctrl + /``. Highlight a code fragment and press ``Ctrl + /``
to comment/uncomment whole blocks of code at a time.

Comments cannot be placed in the middle of a statement continued
on multiple lines. Read more on this here: :doc:`Line_wrapping`.
