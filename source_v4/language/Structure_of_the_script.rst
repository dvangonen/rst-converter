Structure of the script
=======================

.. include:: <isonum.txt>

A script in Pine usually consists of:

* ``//@version=4`` A compiler directive in a comment that specifies which version of Pine the script will use.
  If the ``@version`` directive is missing, version 1 will be used. It is strongly recommended to always
  use the latest version available.
* A `study <https://www.tradingview.com/pine-script-reference/v4/#fun_study>`__ or a
  `strategy <https://www.tradingview.com/pine-script-reference/v4/#fun_strategy>`__ annotation call.
  Their parameters define the script's title and other properties.
* A series of statements which implement the script's algorithm.
  Each statement is usually placed on a separate line. It is possible to place more
  than one statement on a line by using the comma (``,``) as a separator.
  Lines containing statements that are not part of local blocks cannot begin with
  white space. Their first character must also be the line's first character.
  Statements may be one of three kinds:

    -  :ref:`variable declarations <variable_declaration>`
    -  :doc:`function declarations <Declaring_functions>`
    -  :doc:`functions and annotations calls <Functions_and_annotations>`

* A *study* must contain at least one function/annotation call which produces some output on the chart
  (e.g., ``plot``, ``plotshape``, ``barcolor``, ``line.new``, etc.).
  A strategy must contain at least one ``strategy.*`` call, e.g., ``strategy.entry``.

  The simplest valid Pine v4 study can be generated using *Pine Editor* |rarr| *New* |rarr| *Blank indicator script*::

    //@version=4
    study("My Script")
    plot(close)

  A simple valid Pine v4 strategy can be generated using *Pine Editor* |rarr| *New* |rarr| *Blank strategy script*::

    //@version=4
    strategy("My Strategy", overlay=true)

    longCondition = crossover(sma(close, 14), sma(close, 28))
    if (longCondition)
        strategy.entry("My Long Entry Id", strategy.long)

    shortCondition = crossunder(sma(close, 14), sma(close, 28))
    if (shortCondition)
        strategy.entry("My Short Entry Id", strategy.short)

