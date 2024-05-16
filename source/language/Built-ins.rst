.. image:: /images/logo/Pine_Script_logo.svg
   :alt: Pine Script™ logo
   :target: https://www.tradingview.com/pine-script-docs/en/v5/Introduction.html
   :align: right
   :width: 100
   :height: 100


.. _PageBuiltInFunctions:


Built-ins
=========

.. contents:: :local:
    :depth: 3


Introduction
------------

Pine Script™ has hundreds of *built-in* variables and functions. 
They provide your scripts with valuable information and make calculations for you, dispensing you from coding them.
The better you know the built-ins, the more you will be able to do with your Pine scripts.

In this page we present an overview of some of Pine Script™'s built-in variables and functions.
They will be covered in more detail in the pages of this manual covering specific themes.

All built-in variables and functions are defined in the Pine Script™ 
`v5 Reference Manual <https://www.tradingview.com/pine-script-reference/v5/>`__. 
It is called a "Reference Manual" because it is the definitive reference on the Pine Script™ language.
It is an essential tool that will accompany you anytime you code in Pine, 
whether you are a beginner or an expert. If you are learning your first programming language,
make the `Reference Manual <https://www.tradingview.com/pine-script-reference/v5/>`__
your friend. Ignoring it will make your programming experience with Pine Script™ difficult and frustrating — as
it would with any other programming language.

Variables and functions in the same family share the same *namespace*, which is a prefix to the function's name. 
The `ta.sma() <https://www.tradingview.com/pine-script-reference/v5/#fun_ta{dot}sma>`__ function, for example, is in the ``ta`` namespace, 
which stands for "technical analysis". A namespace can contain both variables and functions.

Some variables have function versions as well, e.g.:

- The `ta.tr <https://www.tradingview.com/pine-script-reference/v5/#fun_ta{dot}tr>`__ variable returns
  the "True Range" of the current bar. The `ta.tr(true) <https://www.tradingview.com/pine-script-reference/v5/#fun_ta{dot}tr>`__
  function call also returns the "True Range", but when the previous `close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__
  value which is normally needed to calculate it is `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__,
  it calculates using ``high - low`` instead.
- The `time <https://www.tradingview.com/pine-script-reference/v5/#var_time>`__ variable gives the time at the 
  `open <https://www.tradingview.com/pine-script-reference/v5/#var_open>`__ of the current bar.
  The `time(timeframe) <https://www.tradingview.com/pine-script-reference/v5/#fun_time>`__ function returns 
  the time of the bar's `open <https://www.tradingview.com/pine-script-reference/v5/#var_open>`__ 
  from the ``timeframe`` specified, even if the chart's timeframe is different.
  The `time(timeframe, session) <https://www.tradingview.com/pine-script-reference/v5/#fun_time>`__ function returns 
  the time of the bar's `open <https://www.tradingview.com/pine-script-reference/v5/#var_open>`__ 
  from the ``timeframe`` specified, but only if it is within the ``session`` time.
  The `time(timeframe, session, timezone) <https://www.tradingview.com/pine-script-reference/v5/#fun_time>`__ function returns 
  the time of the bar's `open <https://www.tradingview.com/pine-script-reference/v5/#var_open>`__ 
  from the ``timeframe`` specified, but only if it is within the ``session`` time in the specified ``timezone``.



.. _PageBuiltInFunctions_BuiltInVariables:

Built-in variables
------------------

Built-in variables exist for different purposes. These are a few examples:

- Price- and volume-related variables:
  `open <https://www.tradingview.com/pine-script-reference/v5/#var_open>`__,
  `high <https://www.tradingview.com/pine-script-reference/v5/#var_high>`__,
  `low <https://www.tradingview.com/pine-script-reference/v5/#var_low>`__,
  `close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__,
  `hl2 <https://www.tradingview.com/pine-script-reference/v5/#var_hl2>`__,
  `hlc3 <https://www.tradingview.com/pine-script-reference/v5/#var_hlc3>`__,
  `ohlc4 <https://www.tradingview.com/pine-script-reference/v5/#var_ohlc4>`__, and
  `volume <https://www.tradingview.com/pine-script-reference/v5/#var_volume>`__.
- Symbol-related information in the ``syminfo`` namespace:
  `syminfo.basecurrency <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo{dot}basecurrency>`__,
  `syminfo.currency <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo{dot}currency>`__,
  `syminfo.description <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo{dot}description>`__,
  `syminfo.mintick <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo{dot}mintick>`__,
  `syminfo.pointvalue <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo{dot}pointvalue>`__,
  `syminfo.prefix <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo{dot}prefix>`__,
  `syminfo.root <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo{dot}root>`__,
  `syminfo.session <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo{dot}session>`__,
  `syminfo.ticker <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo{dot}ticker>`__,
  `syminfo.tickerid <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo{dot}tickerid>`__,
  `syminfo.timezone <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo{dot}timezone>`__, and
  `syminfo.type <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo{dot}type>`__.
- Timeframe (a.k.a. "interval" or "resolution", e.g., 15sec, 30min, 60min, 1D, 3M) 
  variables in the ``timeframe`` namespace:
  `timeframe.isseconds <https://www.tradingview.com/pine-script-reference/v5/#var_timeframe{dot}isseconds>`__,
  `timeframe.isminutes <https://www.tradingview.com/pine-script-reference/v5/#var_timeframe{dot}isminutes>`__,
  `timeframe.isintraday <https://www.tradingview.com/pine-script-reference/v5/#var_timeframe{dot}isintraday>`__,
  `timeframe.isdaily <https://www.tradingview.com/pine-script-reference/v5/#var_timeframe{dot}isdaily>`__,
  `timeframe.isweekly <https://www.tradingview.com/pine-script-reference/v5/#var_timeframe{dot}isweekly>`__,
  `timeframe.ismonthly <https://www.tradingview.com/pine-script-reference/v5/#var_timeframe{dot}ismonthly>`__,
  `timeframe.isdwm <https://www.tradingview.com/pine-script-reference/v5/#var_timeframe{dot}isdwm>`__,
  `timeframe.multiplier <https://www.tradingview.com/pine-script-reference/v5/#var_timeframe{dot}multiplier>`__, and
  `timeframe.period <https://www.tradingview.com/pine-script-reference/v5/#var_timeframe{dot}period>`__.
- Bar states in the ``barstate`` namespace (see the :ref:`Bar states <PageBarStates>` page):
  `barstate.isconfirmed <https://www.tradingview.com/pine-script-reference/v5/#var_barstate{dot}isconfirmed>`__,
  `barstate.isfirst <https://www.tradingview.com/pine-script-reference/v5/#var_barstate{dot}isfirst>`__,
  `barstate.ishistory <https://www.tradingview.com/pine-script-reference/v5/#var_barstate{dot}ishistory>`__,
  `barstate.islast <https://www.tradingview.com/pine-script-reference/v5/#var_barstate{dot}islast>`__,
  `barstate.islastconfirmedhistory <https://www.tradingview.com/pine-script-reference/v5/#var_barstate{dot}islastconfirmedhistory>`__,
  `barstate.isnew <https://www.tradingview.com/pine-script-reference/v5/#var_barstate{dot}isnew>`__, and
  `barstate.isrealtime <https://www.tradingview.com/pine-script-reference/v5/#var_barstate{dot}isrealtime>`__.
- Strategy-related information in the ``strategy`` namespace:
  `strategy.equity <https://www.tradingview.com/pine-script-reference/v5/#var_strategy{dot}equity>`__,
  `strategy.initial_capital <https://www.tradingview.com/pine-script-reference/v5/#var_strategy{dot}initial_capital>`__,
  `strategy.grossloss <https://www.tradingview.com/pine-script-reference/v5/#var_strategy{dot}grossloss>`__,
  `strategy.grossprofit <https://www.tradingview.com/pine-script-reference/v5/#var_strategy{dot}grossprofit>`__,
  `strategy.wintrades <https://www.tradingview.com/pine-script-reference/v5/#var_strategy{dot}wintrades>`__,
  `strategy.losstrades <https://www.tradingview.com/pine-script-reference/v5/#var_strategy{dot}losstrades>`__,
  `strategy.position_size <https://www.tradingview.com/pine-script-reference/v5/#var_strategy{dot}position_size>`__,
  `strategy.position_avg_price <https://www.tradingview.com/pine-script-reference/v5/#var_strategy{dot}position_avg_price>`__,
  `strategy.wintrades <https://www.tradingview.com/pine-script-reference/v5/#var_strategy{dot}wintrades>`__, etc.



.. _PageBuiltInFunctions_BuiltInFunctions:

Built-in functions
------------------

Many functions are used for the result(s) they return. These are a few examples:

- Math-related functions in the ``math`` namespace: 
  `math.abs() <https://www.tradingview.com/pine-script-reference/v5/#fun_math{dot}abs>`__,
  `math.log() <https://www.tradingview.com/pine-script-reference/v5/#fun_math{dot}log>`__,
  `math.max() <https://www.tradingview.com/pine-script-reference/v5/#fun_math{dot}max>`__,
  `math.random() <https://www.tradingview.com/pine-script-reference/v5/#fun_math{dot}random>`__,
  `math.round_to_mintick() <https://www.tradingview.com/pine-script-reference/v5/#fun_math{dot}round_to_mintick>`__, etc.
- Technical indicators in the ``ta`` namespace:
  `ta.sma() <https://www.tradingview.com/pine-script-reference/v5/#fun_ta{dot}sma>`__,
  `ta.ema() <https://www.tradingview.com/pine-script-reference/v5/#fun_ta{dot}ema>`__,
  `ta.macd() <https://www.tradingview.com/pine-script-reference/v5/#fun_ta{dot}macd>`__,
  `ta.rsi() <https://www.tradingview.com/pine-script-reference/v5/#fun_ta{dot}rsi>`__,
  `ta.supertrend() <https://www.tradingview.com/pine-script-reference/v5/#fun_ta{dot}supertrend>`__, etc.
- Support functions often used to calculate technical indicators in the ``ta`` namespace:
  `ta.barssince() <https://www.tradingview.com/pine-script-reference/v5/#fun_ta{dot}barssince>`__,
  `ta.crossover() <https://www.tradingview.com/pine-script-reference/v5/#fun_ta{dot}crossover>`__,
  `ta.highest() <https://www.tradingview.com/pine-script-reference/v5/#fun_ta{dot}highest>`__, etc.
- Functions to request data from other symbols or timeframes in the ``request`` namespace:
  `request.dividends() <https://www.tradingview.com/pine-script-reference/v5/#fun_request{dot}dividends>`__,
  `request.earnings() <https://www.tradingview.com/pine-script-reference/v5/#fun_request{dot}earnings>`__,
  `request.financial() <https://www.tradingview.com/pine-script-reference/v5/#fun_request{dot}financial>`__,
  `request.quandl() <https://www.tradingview.com/pine-script-reference/v5/#fun_request{dot}quandl>`__,
  `request.security() <https://www.tradingview.com/pine-script-reference/v5/#fun_request{dot}security>`__,
  `request.splits() <https://www.tradingview.com/pine-script-reference/v5/#fun_request{dot}splits>`__.
- Functions to manipulate strings in the ``str`` namespace:
  `str.format() <https://www.tradingview.com/pine-script-reference/v5/#fun_str{dot}format>`__,
  `str.length() <https://www.tradingview.com/pine-script-reference/v5/#fun_str{dot}length>`__,
  `str.tonumber() <https://www.tradingview.com/pine-script-reference/v5/#fun_str{dot}tonumber>`__,
  `str.tostring() <https://www.tradingview.com/pine-script-reference/v5/#fun_str{dot}tostring>`__, etc.
- Functions used to define the input values that script users can modify in the script's "Settings/Inputs" tab, in the ``input`` namespace:
  `input() <https://www.tradingview.com/pine-script-reference/v5/#fun_input>`__,
  `input.color() <https://www.tradingview.com/pine-script-reference/v5/#fun_input{dot}color>`__,
  `input.int() <https://www.tradingview.com/pine-script-reference/v5/#fun_input{dot}int>`__,
  `input.session() <https://www.tradingview.com/pine-script-reference/v5/#fun_input{dot}session>`__,
  `input.symbol() <https://www.tradingview.com/pine-script-reference/v5/#fun_input{dot}symbol>`__, etc.
- Functions used to manipulate colors in the ``color`` namespace:
  `color.from_gradient() <https://www.tradingview.com/pine-script-reference/v5/#fun_color{dot}from_gradient>`__,
  `color.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_color{dot}rgb>`__,
  `color.rgb() <https://www.tradingview.com/pine-script-reference/v5/#fun_color{dot}new>`__, etc.

Some functions do not return a result but are used for their side effects, which means they do something, even if they don't return a result:

- Functions used as a declaration statement defining one of three types of Pine scripts, and its properties. Each script must begin with a call to one of these functions:
  `indicator() <https://www.tradingview.com/pine-script-reference/v5/#fun_indicator>`__,
  `strategy() <https://www.tradingview.com/pine-script-reference/v5/#fun_strategy>`__ or 
  `library() <https://www.tradingview.com/pine-script-reference/v5/#fun_library>`__.
- Plotting or coloring functions:
  `bgcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_bgcolor>`__,
  `plotbar() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotbar>`__,
  `plotcandle() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotcandle>`__,
  `plotchar() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotchar>`__,
  `plotshape() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotshape>`__,
  `fill() <https://www.tradingview.com/pine-script-reference/v5/#fun_fill>`__.
- Strategy functions placing orders, in the ``strategy`` namespace:
  `strategy.cancel() <https://www.tradingview.com/pine-script-reference/v5/#fun_strategy{dot}cancel>`__,
  `strategy.close() <https://www.tradingview.com/pine-script-reference/v5/#fun_strategy{dot}close>`__,
  `strategy.entry() <https://www.tradingview.com/pine-script-reference/v5/#fun_strategy{dot}entry>`__,
  `strategy.exit() <https://www.tradingview.com/pine-script-reference/v5/#fun_strategy{dot}exit>`__,
  `strategy.order() <https://www.tradingview.com/pine-script-reference/v5/#fun_strategy{dot}order>`__, etc.
- Strategy functions returning information on indivdual past trades, in the ``strategy`` namespace:
  `strategy.closedtrades.entry_bar_index() <https://www.tradingview.com/pine-script-reference/v5/#fun_strategy{dot}closedtrades{dot}entry_bar_index>`__,
  `strategy.closedtrades.entry_price() <https://www.tradingview.com/pine-script-reference/v5/#fun_strategy{dot}closedtrades{dot}entry_price>`__,
  `strategy.closedtrades.entry_time() <https://www.tradingview.com/pine-script-reference/v5/#fun_strategy{dot}closedtrades{dot}entry_time>`__,
  `strategy.closedtrades.exit_bar_index() <https://www.tradingview.com/pine-script-reference/v5/#fun_strategy{dot}closedtrades{dot}exit_bar_index>`__,
  `strategy.closedtrades.max_drawdown() <https://www.tradingview.com/pine-script-reference/v5/#fun_strategy{dot}closedtrades{dot}max_drawdown>`__,
  `strategy.closedtrades.max_runup() <https://www.tradingview.com/pine-script-reference/v5/#fun_strategy{dot}closedtrades{dot}max_runup>`__,
  `strategy.closedtrades.profit() <https://www.tradingview.com/pine-script-reference/v5/#fun_strategy{dot}closedtrades{dot}profit>`__, etc.
- Functions to generate alert events:
  `alert() <https://www.tradingview.com/pine-script-reference/v5/#fun_alert>`__ and
  `alertcondition() <https://www.tradingview.com/pine-script-reference/v5/#fun_alertcondition>`__.

Other functions return a result, but we don't always use it, e.g.:
`hline() <https://www.tradingview.com/pine-script-reference/v5/#fun_hline>`__,
`plot() <https://www.tradingview.com/pine-script-reference/v5/#fun_plot>`__,
`array.pop() <https://www.tradingview.com/pine-script-reference/v5/#fun_array{dot}pop>`__,
`label.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_label{dot}new>`__, etc.

All built-in functions are defined in the Pine Script™ `v5 Reference Manual <https://www.tradingview.com/pine-script-reference/v5/>`__. 
You can click on any of the function names listed here to go to its entry in the Reference Manual, 
which documents the function's signature, i.e., the list of *parameters* it accepts and the qualified type of the value(s) it returns 
(a function can return more than one result). The Reference Manual entry will also list, for each parameter:

- Its name.
- The qualified type of the value it requires (we use *argument* to name the values passed to a function when calling it).
- If the parameter is required or not.

All built-in functions have one or more parameters defined in their signature. Not all parameters are required for every function.

Let's look at the `ta.vwma() <https://www.tradingview.com/pine-script-reference/v5/#fun_ta{dot}vwma>`__ function, 
which returns the volume-weighted moving average of a source value. This is its entry in the Reference Manual: 

.. image:: images/BuiltIns-BuiltInFunctions.png

The entry gives us the information we need to use it:

- What the function does.
- Its signature (or definition):

.. code-block:: text

    ta.vwma(source, length) → series float

- The parameters it includes: ``source`` and ``length``
- The qualified type of the result it returns: "series float".
- An example showing it in use: ``plot(ta.vwma(close, 15))``.
- An example showing what it does, but in long form, so you can better understand its calculations. 
  Note that this is meant to explain — not as usable code, because it is more complicated and takes longer to execute. 
  There are only disadvantages to using the long form.
- The "RETURNS" section explains exacty what value the function returns.
- The "ARGUMENTS" section lists each parameter and gives the critical information 
  concerning what qualified type is required for arguments used when calling the function.
- The "SEE ALSO" section refers you to related Reference Manual entries.

This is a call to the function in a line of code that declares a ``myVwma`` variable 
and assigns the result of ``ta.vwma(close, 20)`` to it:

::

    myVwma = ta.vwma(close, 20)

Note that:

- We use the built-in variable `close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__ as the argument for the ``source`` parameter.
- We use ``20`` as the argument for the ``length`` parameter.
- If placed in the global scope (i.e., starting in a line's first position), 
  it will be executed by the Pine Script™ runtime on each bar of the chart.

We can also use the parameter names when calling the function. Parameter names are called *keyword arguments* when used in a function call:

::

    myVwma = ta.vwma(source = close, length = 20)

You can change the position of arguments when using keyword arguments, but only if you use them for all your arguments. 
When calling functions with many parameters such as `indicator() <https://www.tradingview.com/pine-script-reference/v5/#fun_indicator>`__,
you can also forego keyword arguments for the first arguments, as long as you don't skip any. If you skip some, 
you must then use keyword arguments so the Pine Script™ compiler can figure out which parameter they correspond to, e.g.:

::

    indicator("Example", "Ex", true, max_bars_back = 100)

Mixing things up this way is not allowed:

::

    indicator(precision = 3, "Example") // Compilation error!
    
**When calling built-ins, it is critical to ensure that the arguments you use are of the required qualified type, which will vary for each parameter.**

To learn how to do this, one needs to understand Pine Script™'s :ref:`type system <PageTypeSystem>`.
The Reference Manual entry for each built-in function includes an "ARGUMENTS" section
which lists the qualified type required for the argument supplied to each of the function's parameters.


.. image:: /images/logo/TradingView_Logo_Block.svg
    :width: 200px
    :align: center
    :target: https://www.tradingview.com/