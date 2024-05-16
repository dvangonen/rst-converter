.. image:: /images/logo/Pine_Script_logo.svg
   :alt: Pine Script™ logo
   :target: https://www.tradingview.com/pine-script-docs/en/v5/Introduction.html
   :align: right
   :width: 100
   :height: 100


.. _PageTypeSystem:


Type system
===========

.. contents:: :local:
    :depth: 3



Introduction
------------

The Pine Script™ type system determines the compatibility of a script's values with various 
functions and operations. While it's possible to write simple scripts without knowing anything about 
the type system, a reasonable understanding of it is necessary to achieve any degree of proficiency 
with the language, and an in-depth knowledge of its subtleties will allow you to harness its full 
potential.

Pine Script™ uses :ref:`types <PageTypeSystem_Types>` to classify all values, and it uses 
:ref:`qualifiers <PageTypeSystem_Qualifiers>` to determine whether values are constant, established 
on the first script iteration, or dynamic throughout a script's execution. This system applies to all 
Pine values, including those from literals, variables, expressions, function returns, and function arguments.

The type system closely intertwines with Pine's :ref:`execution model <PageExecutionModel>` 
and :ref:`time series <PageTimeSeries>` concepts. Understanding all three is essential for making the most 
of the power of Pine Script™.

.. note::
   For the sake of brevity, we often use "type" to refer to a "qualified type".



.. _PageTypeSystem_Qualifiers:

Qualifiers
----------

Pine Script™ *qualifiers* identify when a value is accessible in the script's execution:

- Values qualified as :ref:`const <PageTypeSystem_Qualifiers_Const>` are established at compile time 
  (i.e., when saving the script in the Pine Editor or adding it to the chart).
- Values qualified as :ref:`input <PageTypeSystem_Qualifiers_Input>` are available at input time 
  (i.e., when changing values in the script's "Settings/Inputs" tab).
- Values qualified as :ref:`simple <PageTypeSystem_Qualifiers_Simple>` are established at bar zero 
  (the first bar of the script's execution).
- Values qualified as :ref:`series <PageTypeSystem_Qualifiers_Series>` can change throughout the script's execution.

Pine Script™ bases the dominance of type qualifiers on the following hierarchy: **const < input < simple < series**, 
where "const" is the *weakest* qualifier and "series" is the *strongest*. The qualifier hierarchy translates into 
this rule: whenever a variable, function, or operation is compatible with a specific qualified type, values with 
*weaker* qualifiers are also allowed.

Scripts always qualify their expressions' returned values based on the dominant qualifier in their calculations. 
For example, evaluating an expression that involves "const" and "series" values will return a value qualified as 
"series". Furthermore, scripts cannot change a value's qualifier to one that's lower on the hierarchy. If a value 
acquires a stronger qualifier (e.g., a value initially inferred as "simple" becomes "series" later in the script's 
execution), that state is irreversible.

Note that only values qualified as "series" can change throughout the execution of a script, which include those 
from various built-ins, such as `close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__ and 
`volume <https://www.tradingview.com/pine-script-reference/v5/#var_volume>`__, as well as the results of any operations 
that involve "series" values. Values qualified as "const", "input", or "simple" are consistent throughout a script's execution.


.. _PageTypeSystem_Qualifiers_Const:

const
^^^^^

Values qualified as "const" are established at *compile time*, before the script starts its execution. 
Compilation initially occurs when saving a script in the Pine Editor, which does not require it to run 
on a chart. Values with the "const" qualifier never change between script iterations, not even on the 
initial bar of its execution. 

Scripts can qualify values as "const" by using a *literal* value or calculating values from expressions that 
only use literal values or other variables qualified as "const". 

These are examples of literal values:

- *literal int*: ``1``, ``-1``, ``42``
- *literal float*: ``1.``, ``1.0``, ``3.14``, ``6.02E-23``, ``3e8``
- *literal bool*: ``true``, ``false``
- *literal color*: ``#FF55C6``, ``#FF55C6ff``
- *literal string*: ``"A text literal"``, ``"Embedded single quotes 'text'"``, ``'Embedded double quotes "text"'``

Users can explicitly define variables and parameters that only accept "const" values by including the ``const`` keyword 
in their declaration. 

Our :ref:`Style guide <PageStyleGuide>` recommends using uppercase SNAKE_CASE to name "const" variables for readability. 
While it is not a requirement, one can also use the `var <https://www.tradingview.com/pine-script-reference/v5/#kw_var>`__ 
keyword when declaring "const" variables so the script only initializes them on the *first bar* of the dataset. 
See :ref:`this section <PageVariableDeclarations_Var>` of our User Manual for more information. 

Below is an example that uses "const" values within `indicator() <https://www.tradingview.com/pine-script-reference/v5/#fun_indicator>`__ 
and `plot() <https://www.tradingview.com/pine-script-reference/v5/#fun_plot>`__ functions, which both require a value of the 
"const string" qualified type as their ``title`` argument:

.. code-block:: pine

    //@version=5

    // The following global variables are all of the "const string" qualified type:

    //@variable The title of the indicator.
    INDICATOR_TITLE = "const demo"
    //@variable The title of the first plot.
    var PLOT1_TITLE = "High"
    //@variable The title of the second plot.
    const string PLOT2_TITLE = "Low"
    //@variable The title of the third plot.
    PLOT3_TITLE = "Midpoint between " + PLOT1_TITLE + " and " + PLOT2_TITLE

    indicator(INDICATOR_TITLE, overlay = true)

    plot(high, PLOT1_TITLE)
    plot(low, PLOT2_TITLE)
    plot(hl2, PLOT3_TITLE)

The following example will raise a compilation error since it uses 
`syminfo.ticker <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo.ticker>`__, which returns a 
"simple" value because it depends on chart information that's only accessible once the script starts its execution:

.. code-block:: pine

    //@version=5

    //@variable The title in the `indicator()` call.
    var NAME = "My indicator for " + syminfo.ticker

    indicator(NAME, "", true) // Causes an error because `NAME` is qualified as a "simple string".
    plot(close)


.. _PageTypeSystem_Qualifiers_Input:

input
^^^^^

Values qualified as "input" are established after initialization via the ``input.*()`` functions. These functions produce values 
that users can modify within the "Inputs" tab of the script's settings. When one changes any of the values in this tab, 
the script re-executes from the beginning of the chart's history to ensure its input values are consistent throughout its execution. 

.. note::
   The `input.source() <https://www.tradingview.com/pine-script-reference/v5/#fun_input.source>`__ function is an exception in 
   the ``input.*()`` namespace, as it returns "series" qualified values rather than "input" since built-in variables such as 
   `open <https://www.tradingview.com/pine-script-reference/v5/#var_open>`__,  `close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__, 
   etc., as well as the values from another script's plots, are qualified as "series". 

The following script plots the value of a ``sourceInput`` from the ``symbolInput`` and ``timeframeInput`` context. 
The `request.security() <https://www.tradingview.com/pine-script-reference/v5/#fun_request.security>`__ call is valid in this script 
since its ``symbol`` and ``timeframe`` parameters allow "simple string" arguments, meaning they can also accept "input string" values 
because the "input" qualifier is *lower* on the hierarchy:

.. code-block:: pine

    //@version=5
    indicator("input demo", overlay = true)

    //@variable The symbol to request data from. Qualified as "input string".
    symbolInput = input.symbol("AAPL", "Symbol")
    //@variable The timeframe of the data request. Qualified as "input string".
    timeframeInput = input.timeframe("D", "Timeframe")
    //@variable The source of the calculation. Qualified as "series float".
    sourceInput = input.source(close, "Source")

    //@variable The `sourceInput` value from the requested context. Qualified as "series float".
    requestedSource = request.security(symbolInput, timeframeInput, sourceInput)

    plot(requestedSource)


.. _PageTypeSystem_Qualifiers_Simple:

simple
^^^^^^

Values qualified as "simple" are available only once the script begins execution on the *first* chart bar of its history, 
and they remain consistent during the script's execution.

Users can explicitly define variables and parameters that accept "simple" values by including the ``simple`` keyword in 
their declaration. 

Many built-in variables return "simple" qualified values because they depend on information that a script can only obtain once it 
starts its execution. Additionally, many built-in functions require "simple" arguments that do not change over time. Wherever a 
script allows "simple" values, it can also accept values qualified as "input" or "const".

This script highlights the background to warn users that they're using a non-standard chart type. It uses the value of 
`chart.is_standard <https://www.tradingview.com/pine-script-reference/v5/#var_chart.is_standard>`__ to calculate the 
``isNonStandard`` variable, then uses that variable's value to calculate a ``warningColor`` that also references a 
"simple" value. The ``color`` parameter of `bgcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_bgcolor>`__ 
allows a "series color" argument, meaning it can also accept a "simple color" value since "simple" is lower on the hierarchy:

.. code-block:: pine

    //@version=5
    indicator("simple demo", overlay = true)

    //@variable Is `true` when the current chart is non-standard. Qualified as "simple bool".
    isNonStandard = not chart.is_standard
    //@variable Is orange when the the current chart is non-standard. Qualified as "simple color".
    simple color warningColor = isNonStandard ? color.new(color.orange, 70) : na

    // Colors the chart's background to warn that it's a non-standard chart type.
    bgcolor(warningColor, title = "Non-standard chart color")


.. _PageTypeSystem_Qualifiers_Series:

series
^^^^^^

Values qualified as "series" provide the most flexibility in scripts since they can change on any bar, 
even multiple times on the same bar. 

Users can explicitly define variables and parameters that accept "series" values by including the ``series`` keyword 
in their declaration. 

Built-in variables such as `open <https://www.tradingview.com/pine-script-reference/v5/#var_open>`__, 
`high <https://www.tradingview.com/pine-script-reference/v5/#var_high>`__, 
`low <https://www.tradingview.com/pine-script-reference/v5/#var_low>`__, 
`close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__, 
`volume <https://www.tradingview.com/pine-script-reference/v5/#var_volume>`__, 
`time <https://www.tradingview.com/pine-script-reference/v5/#var_time>`__, and 
`bar_index <https://www.tradingview.com/pine-script-reference/v5/#var_bar_index>`__, and the result from 
any expression using such built-ins, are qualified as "series". The result of any function or operation 
that returns a dynamic value will always be a "series", as will the results from using the history-referencing 
operator `[] <https://www.tradingview.com/pine-script-reference/v5/#op_[]>`__ to access historical values. 
Wherever a script allows "series" values, it will also accept values with any other qualifier, as "series" is the 
*highest* qualifier on the hierarchy.

This script displays the `highest <https://www.tradingview.com/pine-script-reference/v5/#fun_ta.highest>`__ 
and `lowest <https://www.tradingview.com/pine-script-reference/v5/#fun_ta.lowest>`__ value of a ``sourceInput`` 
over ``lengthInput`` bars. The values assigned to the ``highest`` and ``lowest`` variables are of the "series float" 
qualified type, as they can change throughout the script's execution:

.. code-block:: pine

    //@version=5
    indicator("series demo", overlay = true)

    //@variable The source value to calculate on. Qualified as "series float".
    series float sourceInput = input.source(close, "Source")
    //@variable The number of bars in the calculation. Qualified as "input int".
    lengthInput = input.int(20, "Length")

    //@variable The highest `sourceInput` value over `lengthInput` bars. Qualified as "series float".
    series float highest = ta.highest(sourceInput, lengthInput)
    //@variable The lowest `sourceInput` value over `lengthInput` bars. Qualified as "series float".
    lowest = ta.lowest(sourceInput, lengthInput)

    plot(highest, "Highest source", color.green)
    plot(lowest, "Lowest source", color.red)



.. _PageTypeSystem_Types:

Types
-----

Pine Script™ *types* classify values and determine the functions and operations they're 
compatible with. They include:

- The fundamental types: :ref:`int <PageTypeSystem_Types_Int>`, :ref:`float <PageTypeSystem_Types_Float>`, 
  :ref:`bool <PageTypeSystem_Types_Bool>`, :ref:`color <PageTypeSystem_Types_Color>`, 
  and :ref:`string <PageTypeSystem_Types_String>`
- The special types: :ref:`plot <PageTypeSystem_Types_PlotAndHline>`, :ref:`hline <PageTypeSystem_Types_PlotAndHline>`, 
  :ref:`line <PageTypeSystem_Types_DrawingTypes>`, :ref:`linefill <PageTypeSystem_Types_DrawingTypes>`, 
  :ref:`box <PageTypeSystem_Types_DrawingTypes>`, :ref:`polyline <PageTypeSystem_Types_DrawingTypes>`, 
  :ref:`label <PageTypeSystem_Types_DrawingTypes>`, :ref:`table <PageTypeSystem_Types_DrawingTypes>`, 
  :ref:`chart.point <PageTypeSystem_Types_ChartPoints>`, :ref:`array <PageTypeSystem_Types_Collections>`, 
  :ref:`matrix <PageTypeSystem_Types_Collections>`, and :ref:`map <PageTypeSystem_Types_Collections>`
- :ref:`User-defined types (UDTs) <PageTypeSystem_UserDefinedTypes>`
- :ref:`void <PageTypeSystem_Types_Void>`

Fundamental types refer to the underlying nature of a value, e.g., a value of 1 is of the "int" type, 1.0 is 
of the "float" type, "AAPL" is of the "string" type, etc. Special types and user-defined types utilize *IDs* 
that refer to objects of a specific class. For example, a value of the "label" type contains an ID that acts 
as a *pointer* referring to a "label" object. The "void" type refers to the output from a function or 
:ref:`method <PageMethods>` that does not return a usable value. 

Pine Script™ can automatically convert values from some types into others. The auto-casting rules are: 
**int → float → bool**. See the :ref:`Type casting <PageTypeSystem_TypeCasting>` section of this page for more information.

In most cases, Pine Script™ can automatically determine a value's type. However, we can also use type keywords to 
*explicitly* specify types for readability and for code that requires explicit definitions (e.g., declaring a variable assigned to 
`na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__). For example:

.. code-block:: pine

    //@version=5
    indicator("Types demo", overlay = true)

    //@variable A value of the "const string" type for the `ma` plot's title.
    string MA_TITLE = "MA"

    //@variable A value of the "input int" type. Controls the length of the average.
    int lengthInput = input.int(100, "Length", minval = 2)

    //@variable A "series float" value representing the last `close` that crossed over the `ma`.
    var float crossValue = na

    //@variable A "series float" value representing the moving average of `close`.
    float ma = ta.sma(close, lengthInput)
    //@variable A "series bool" value that's `true` when the `close` crosses over the `ma`.
    bool crossUp = ta.crossover(close, ma)
    //@variable A "series color" value based on whether `close` is above or below its `ma`.
    color maColor = close > ma ? color.lime : color.fuchsia

    // Update the `crossValue`.
    if crossUp
        crossValue := close

    plot(ma, MA_TITLE, maColor)
    plot(crossValue, "Cross value", style = plot.style_circles)
    plotchar(crossUp, "Cross Up", "▲", location.belowbar, size = size.small)


.. _PageTypeSystem_Types_Int:

int
^^^

Values of the "int" type represent integers, i.e., whole numbers without any fractional quantities.

Integer literals are numeric values written in *decimal* notation. For example:

::

    1
    -1
    750

Built-in variables such as 
`bar_index <https://www.tradingview.com/pine-script-reference/v5/#var_bar_index>`__, 
`time <https://www.tradingview.com/pine-script-reference/v5/#var_time>`__, 
`timenow <https://www.tradingview.com/pine-script-reference/v5/#var_timenow>`__, 
`dayofmonth <https://www.tradingview.com/pine-script-reference/v5/#var_dayofmonth>`__, and 
`strategy.wintrades <https://www.tradingview.com/pine-script-reference/v5/#var_strategy.wintrades>`__ all 
return values of the "int" type.


.. _PageTypeSystem_Types_Float:

float
^^^^^

Values of the "float" type represent floating-point numbers, i.e., numbers that can contain whole 
and fractional quantities.

Floating-point literals are numeric values written with a ``.`` delimiter. They may also contain 
the symbol ``e`` or ``E`` (which means "10 raised to the power of X", where X is the number after the 
``e`` or ``E`` symbol). For example:

::

    3.14159    // Rounded value of Pi (π)
    - 3.0
    6.02e23    // 6.02 * 10^23 (a very large value)
    1.6e-19    // 1.6 * 10^-19 (a very small value)

The internal precision of "float" values in Pine Script™ is 1e-16.

Built-in variables such as 
`close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__,
`hlcc4 <https://www.tradingview.com/pine-script-reference/v5/#var_hlcc4>`__,
`volume <https://www.tradingview.com/pine-script-reference/v5/#var_volume>`__, 
`ta.vwap <https://www.tradingview.com/pine-script-reference/v5/#var_ta.vwap>`__, and 
`strategy.position_size <https://www.tradingview.com/pine-script-reference/v5/#var_strategy.position_size>`__ 
all return values of the "float" type.


.. _PageTypeSystem_Types_Bool:

bool
^^^^

Values of the "bool" type represent the truth value of a comparison or condition, which scripts 
can use in :ref:`conditional structures <PageConditionalStructures>` and other expressions. 

There are only two literals that represent boolean values:

::

    true    // true value
    false   // false value

When an expression of the "bool" type returns `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__, 
scripts treat its value as ``false`` when evaluating conditional statements and operators.

Built-in variables such as 
`barstate.isfirst <https://www.tradingview.com/pine-script-reference/v5/#var_barstate.isfirst>`__, 
`chart.is_heikinashi <https://www.tradingview.com/pine-script-reference/v5/#var_chart.is_heikinashi>`__, 
`session.ismarket <https://www.tradingview.com/pine-script-reference/v5/#var_session.ismarket>`__, and 
`timeframe.isdaily <https://www.tradingview.com/pine-script-reference/v5/#var_timeframe.isdaily>`__ all 
return values of the "bool" type.


.. _PageTypeSystem_Types_Color:

color
^^^^^

Color literals have the following format: ``#RRGGBB`` or ``#RRGGBBAA``. The letter pairs represent 
*hexadecimal* values between ``00`` and ``FF`` (0 to 255 in decimal) where:

- ``RR``, ``GG`` and ``BB`` pairs respectively represent the values for the color's red, green and blue components.
- ``AA`` is an optional value for the color's opacity (or *alpha* component) where ``00`` is invisible and ``FF`` opaque. 
  When the literal does not include an ``AA`` pair, the script treats it as fully opaque (the same as using ``FF``).
- The hexadecimal letters in the literals can be uppercase or lowercase.

These are examples of "color" literals:

::

    #000000      // black color
    #FF0000      // red color
    #00FF00      // green color
    #0000FF      // blue color
    #FFFFFF      // white color
    #808080      // gray color
    #3ff7a0      // some custom color
    #FF000080    // 50% transparent red color
    #FF0000ff    // same as #FF0000, fully opaque red color
    #FF000000    // completely transparent red color

Pine Script™ also has :ref:`built-in color constants <PageColors_ConstantColors>`, including  
`color.green <https://www.tradingview.com/pine-script-reference/v5/#const_color{dot}green>`__, 
`color.red <https://www.tradingview.com/pine-script-reference/v5/#const_color{dot}red>`__, 
`color.orange <https://www.tradingview.com/pine-script-reference/v5/#const_color{dot}orange>`__, 
`color.blue <https://www.tradingview.com/pine-script-reference/v5/#const_color{dot}blue>`__
(the default color in ``plot*()`` functions and many of the default color-related properties in 
:ref:`drawing types <PageTypeSystem_Types_DrawingTypes>`), etc. 

When using built-in color constants, it is possible to add transparency information to them via the 
`color.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_color.new>`__ function. 

Note that when specifying red, green or blue components in ``color.*()`` functions, we use "int" or "float" 
arguments with values between 0 and 255. When specifying transparency, we use a value between 0 and 100, 
where 0 means fully opaque and 100 means completely transparent. For example:

.. code-block:: pine

    //@version=5
    indicator("Shading the chart's background", overlay = true)

    //@variable A "const color" value representing the base for each day's color. 
    color BASE_COLOR = color.rgb(0, 99, 165)

    //@variable A "series int" value that modifies the transparency of the `BASE_COLOR` in `color.new()`.
    int transparency = 50 + int(40 * dayofweek / 7)

    // Color the background using the modified `BASE_COLOR`.
    bgcolor(color.new(BASE_COLOR, transparency))

See the User Manual's page on :ref:`colors <PageColors>` for more information on using colors in scripts.


.. _PageTypeSystem_Types_String:

string
^^^^^^

Values of the "string" type represent sequences of letters, numbers, symbols, spaces, and other characters. 

String literals in Pine are characters enclosed in single or double quotation marks. For example:

::

    "This is a string literal using double quotes."
    'This is a string literal using single quotes.'

Single and double quotation marks are functionally equivalent in Pine Script™.
A "string" enclosed within double quotation marks can contain any number of single quotation 
marks and vice versa:

::

    "It's an example"
    'The "Star" indicator'

Scripts can *escape* the enclosing delimiter in a "string" using the backslash character (``\``).
For example:

::

    'It\'s an example'
    "The \"Star\" indicator"

We can create "string" values containing the new line escape character (``\n``) for displaying multi-line 
text with ``plot*()`` and ``log.*()`` functions and objects of :ref:`drawing types <PageTypeSystem_Types_DrawingTypes>`. 
For example:

::

    "This\nString\nHas\nOne\nWord\nPer\nLine"

We can use the `+ <https://www.tradingview.com/pine-script-reference/v5/#op_+>`__ operator to concatenate "string" values:

::

    "This is a " + "concatenated string."

The built-ins in the ``str.*()`` namespace create "string" values using specialized operations. 
For instance, this script creates a *formatted string* to represent "float" price values 
and displays the result using a label:

.. code-block:: pine

    //@version=5
    indicator("Formatted string demo", overlay = true)

    //@variable A "series string" value representing the bar's OHLC data.
    string ohlcString = str.format("Open: {0}\nHigh: {1}\nLow: {2}\nClose: {3}", open, high, low, close)

    // Draw a label containing the `ohlcString`.
    label.new(bar_index, high, ohlcString, textcolor = color.white)

See our User Manual's page on :ref:`Text and shapes <PageTextAndShapes>` for more information about displaying 
"string" values from a script.

Built-in variables such as 
`syminfo.tickerid <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo.tickerid>`__, 
`syminfo.currency <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo.currency>`__, and 
`timeframe.period <https://www.tradingview.com/pine-script-reference/v5/#var_timeframe.period>`__ 
return values of the "string" type. 


.. _PageTypeSystem_Types_PlotAndHline:

plot and hline
^^^^^^^^^^^^^^

Pine Script™'s `plot() <https://www.tradingview.com/pine-script-reference/v5/#fun_plot>`__ and 
`hline() <https://www.tradingview.com/pine-script-reference/v5/#fun_hline>`__ functions return IDs that 
respectively reference instances of the "plot" and "hline" types. These types display calculated values and 
horizontal levels on the chart, and one can assign their IDs to variables for use with the built-in 
`fill() <https://www.tradingview.com/pine-script-reference/v5/#fun_fill>`__ function.

For example, this script plots two EMAs on the chart and fills the space between them using the 
`fill() <https://www.tradingview.com/pine-script-reference/v5/#fun_fill>`__ function:

.. code-block:: pine

    //@version=5
    indicator("plot fill demo", overlay = true)

    //@variable A "series float" value representing a 10-bar EMA of `close`.
    float emaFast = ta.ema(close, 10)
    //@variable A "series float" value representing a 20-bar EMA of `close`.
    float emaSlow = ta.ema(close, 20)

    //@variable The plot of the `emaFast` value.
    emaFastPlot = plot(emaFast, "Fast EMA", color.orange, 3)
    //@variable The plot of the `emaSlow` value.
    emaSlowPlot = plot(emaSlow, "Slow EMA", color.gray, 3)

    // Fill the space between the `emaFastPlot` and `emaSlowPlot`.
    fill(emaFastPlot, emaSlowPlot, color.new(color.purple, 50), "EMA Fill")

It's important to note that unlike other special types, there is no ``plot`` or ``hline`` keyword in Pine to 
explicitly declare a variable's type as "plot" or "hline".

Users can control where their scripts' plots display via the variables in the ``display.*`` namespace. 
Additionally, one script can use the values from another script's plots as *external inputs* via the 
`input.source() <https://www.tradingview.com/pine-script-reference/v5/#fun_input.source>`__ function 
(see our User Manual's section on :ref:`source inputs <PageInputs_InputTypes_SourceInput>`). 


.. _PageTypeSystem_Types_DrawingTypes:

Drawing types
^^^^^^^^^^^^^

Pine Script™ drawing types allow scripts to create custom drawings on charts. They include the following: 
`line <https://www.tradingview.com/pine-script-reference/v5/#type_line>`__, 
`linefill <https://www.tradingview.com/pine-script-reference/v5/#type_linefill>`__, 
`box <https://www.tradingview.com/pine-script-reference/v5/#type_box>`__, 
`polyline <https://www.tradingview.com/pine-script-reference/v5/#type_polyline>`__, 
`label <https://www.tradingview.com/pine-script-reference/v5/#type_label>`__, and 
`table <https://www.tradingview.com/pine-script-reference/v5/#type_table>`__.

Each type also has a namespace containing all the built-ins that create and manage drawing instances. 
For example, the following ``*.new()`` constructors create new objects of these types in a script: 
`line.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_line.new>`__,
`linefill.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_linefill.new>`__, 
`box.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_box.new>`__, 
`polyline.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_polyline.new>`__, 
`label.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_label.new>`__, and 
`table.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_table.new>`__. 

Each of these functions returns an *ID* which is a reference that uniquely identifies a drawing object. 
IDs are always qualified as "series", meaning their qualified types are "series line", "series label", etc.
Drawing IDs act like pointers, as each ID references a specific instance of a drawing in all the functions 
from that drawing's namespace. 
For instance, the ID of a line returned by a `line.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_line.new>`__ 
call is used later to refer to that specific object once it's time to delete it with 
`line.delete() <https://www.tradingview.com/pine-script-reference/v5/#fun_line.delete>`__.


.. _PageTypeSystem_Types_ChartPoints:

Chart points
^^^^^^^^^^^^

Chart points are special types that represent coordinates on the chart. 
Scripts use the information from `chart.point <https://www.tradingview.com/pine-script-reference/v5/#type_chart.point>`__ 
objects to determine the chart locations of :ref:`lines <PageLinesAndBoxes_Lines>`, :ref:`boxes <PageLinesAndBoxes_Boxes>`, 
:ref:`polylines <PageLinesAndBoxes_Polylines>`, and :ref:`labels <PageTextAndShapes_Labels>`.

Objects of this type contain three *fields*: ``time``, ``index``, and ``price``. 
Whether a drawing instance uses the ``time`` or ``price`` field from a 
`chart.point <https://www.tradingview.com/pine-script-reference/v5/#type_chart.point>`__  
as an x-coordinate depends on the drawing's ``xloc`` property. 

We can use any of the following functions to create chart points in a script:

* `chart.point.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_chart.point.new>`__ - Creates a new `chart.point <https://www.tradingview.com/pine-script-reference/v5/#type_chart.point>`__ with a specified ``time``, ``index``, and ``price``.
* `chart.point.now() <https://www.tradingview.com/pine-script-reference/v5/#fun_chart.point.now>`__ - Creates a new `chart.point <https://www.tradingview.com/pine-script-reference/v5/#type_chart.point>`__ with a specified ``price`` y-coordinate. The ``time`` and ``index`` fields contain the `time <https://www.tradingview.com/pine-script-reference/v5/#var_time>`__ and `bar_index <https://www.tradingview.com/pine-script-reference/v5/#var_bar_index>`__ of the bar the function executes on.
* `chart.point_from_index() <https://www.tradingview.com/pine-script-reference/v5/#fun_chart.point.from_index>`__ - Creates a new `chart.point <https://www.tradingview.com/pine-script-reference/v5/#type_chart.point>`__ with an ``index`` x-coordinate and ``price`` y-coordinate. The ``time`` field of the resulting instance is `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__, meaning it will not work with drawing objects that use an ``xloc`` value of `xloc.bar_time <https://www.tradingview.com/pine-script-reference/v5/#var_xloc.bar_time>`__.
* `chart.point.from_time() <https://www.tradingview.com/pine-script-reference/v5/#fun_chart.point.from_time>`__ - Creates a new `chart.point <https://www.tradingview.com/pine-script-reference/v5/#type_chart.point>`__ with a ``time`` x-coordinate and ``price`` y-coordinate. The ``index`` field of the resulting instance is `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__, meaning it will not work with drawing objects that use an ``xloc`` value of `xloc.bar_index <https://www.tradingview.com/pine-script-reference/v5/#var_xloc.bar_index>`__.
* `chart.point.copy() <https://www.tradingview.com/pine-script-reference/v5/#fun_chart.point.copy>`__ - Creates a new `chart.point <https://www.tradingview.com/pine-script-reference/v5/#type_chart.point>`__ containing the same ``time``, ``index``, and ``price`` information as the ``id`` in the function call.

This example draws lines connecting the previous bar's `high <https://www.tradingview.com/pine-script-reference/v5/#var_high>`__ 
to the current bar's `low <https://www.tradingview.com/pine-script-reference/v5/#var_low>`__ on each chart bar. 
It also displays labels at both points of each line. The line and labels get their information from 
the ``firstPoint`` and ``secondPoint`` variables, which reference chart points created using 
`chart.point_from_index() <https://www.tradingview.com/pine-script-reference/v5/#fun_chart.point.from_index>`__ and 
`chart.point.now() <https://www.tradingview.com/pine-script-reference/v5/#fun_chart.point.now>`__:

.. code-block:: pine

    //@version=5
    indicator("Chart points demo", overlay = true)

    //@variable A new `chart.point` at the previous `bar_index` and `high`.
    firstPoint = chart.point.from_index(bar_index - 1, high[1])
    //@variable A new `chart.point` at the current bar's `low`.
    secondPoint = chart.point.now(low)

    // Draw a new line connecting coordinates from the `firstPoint` and `secondPoint`.
    // This line uses the `index` fields from the points as x-coordinates.
    line.new(firstPoint, secondPoint, color = color.purple, width = 3)
    // Draw a label at the `firstPoint`. Uses the point's `index` field as its x-coordinate.
    label.new(
         firstPoint, str.tostring(firstPoint.price), color = color.green, 
         style = label.style_label_down, textcolor = color.white
     )
    // Draw a label at the `secondPoint`. Uses the point's `index` field as its x-coordinate.
    label.new(
         secondPoint, str.tostring(secondPoint.price), color = color.red, 
         style = label.style_label_up, textcolor = color.white
     )


.. _PageTypeSystem_Types_Collections:

Collections
^^^^^^^^^^^

Collections in Pine Script™ (:ref:`arrays <PageArrays>`, :ref:`matrices <PageMatrices>`, 
and :ref:`maps <PageMaps>`) utilize reference IDs, much like other special types (e.g., labels).
The type of the ID defines the type of *elements* the collection will contain.
In Pine, we specify array, matrix, and map types by appending a :ref:`type template <PageTypeSystem_TypeTemplates>` 
to the `array <https://www.tradingview.com/pine-script-reference/v5/#type_array>`__, 
`matrix <https://www.tradingview.com/pine-script-reference/v5/#type_matrix>`__,
or `map <https://www.tradingview.com/pine-script-reference/v5/#type_map>`__ keywords:

- ``array<int>`` defines an array containing "int" elements.
- ``array<label>`` defines an array containing "label" IDs.
- ``array<UDT>`` defines an array containing IDs referencing objects of a :ref:`user-defined type (UDT) <PageTypeSystem_UserDefinedTypes>`.
- ``matrix<float>`` defines a matrix containing "float" elements.
- ``matrix<UDT>`` defines a matrix containing IDs referencing objects of a :ref:`user-defined type (UDT) <PageTypeSystem_UserDefinedTypes>`.
- ``map<string, float>`` defines a map containing "string" keys and "float" values.
- ``map<int, UDT>`` defines a map containing "int" keys and IDs of :ref:`user-defined type (UDT) <PageTypeSystem_UserDefinedTypes>` instances as values.

For example, one can declare an "int" array with a single element value of 10 in any of the following, equivalent ways:

::

    a1 = array.new<int>(1, 10)
    array<int> a2 = array.new<int>(1, 10)
    a3 = array.from(10)
    array<int> a4 = array.from(10)

Note that: 
 - The ``int[]`` syntax can also specify an array of "int" elements, but its use is discouraged.
   No equivalent exists to specify the types of matrices or maps in that way. 
 - Type-specific built-ins exist for arrays, such as 
   `array.new_int() <https://www.tradingview.com/pine-script-reference/v5/#fun_array{dot}new_int>`__, 
   but the more generic `array.new<type> <https://www.tradingview.com/pine-script-reference/v5/#type_array>`__ 
   form is preferred, which would be ``array.new<int>()`` to create an array of "int" elements.


.. _PageTypeSystem_UserDefinedTypes:	

User-defined types
^^^^^^^^^^^^^^^^^^

The `type <https://www.tradingview.com/pine-script-reference/v5/#kw_type>`__ 	
keyword allows the creation of *user-defined types* (UDTs) from which scripts can 
create :ref:`objects <PageObjects>`.
UDTs are composite types; they contain an arbitrary number of *fields* that can be of any type, 
including other user-defined types. 	
The syntax to define a user-defined type is:	

.. code-block:: text
    	
    [export] type <UDT_identifier>	
        <field_type> <field_name> [= <value>]	
        ...	

where:	

- ``export`` is the keyword that a `library <https://www.tradingview.com/pine-script-reference/v5/#fun_library>`__ 
  script uses to export the user-defined type. To learn more about exporting UDTs, see our User Manual's 
  :ref:`Libraries <PageLibraries_Objects>` page.	
- ``<UDT_identifier>`` is the name of the user-defined type.	
- ``<field_type>`` is the type of the field.	
- ``<field_name>`` is the name of the field.	
- ``<value>`` is an optional default value for the field, which the script will assign to it when creating new objects of that UDT. 
  If one does not provide a value, the field's default is `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__.	
  The same rules as those governing the default values of parameters in function signatures apply to the default values of fields. 
  For example, a UDT's default values cannot use results from the history-referencing operator 
  `[] <https://www.tradingview.com/pine-script-reference/v5/#op_[]>`__ or expressions. 

This example declares a ``pivotPoint`` UDT with an "int" ``pivotTime`` field and a 
"float" ``priceLevel`` field that will respectively hold time and price information about 
a calculated pivot:

::	

    //@type             A user-defined type containing pivot information.
    //@field pivotTime  Contains time information about the pivot.
    //@field priceLevel Contains price information about the pivot.
    type pivotPoint
        int   pivotTime
        float priceLevel

User-defined types support *type recursion*, i.e., the fields of a UDT can reference objects of the same UDT.
Here, we've added a ``nextPivot`` field to our previous ``pivotPoint`` type that references another ``pivotPoint`` instance:	

::	

    //@type             A user-defined type containing pivot information.
    //@field pivotTime  Contains time information about the pivot.
    //@field priceLevel Contains price information about the pivot.
    //@field nextPivot  A `pivotPoint` instance containing additional pivot information.
    type pivotPoint
        int        pivotTime
        float      priceLevel
        pivotPoint nextPivot

Scripts can use two built-in methods to create and copy UDTs: ``new()`` and ``copy()``. See our User Manual's page on 
:ref:`Objects <PageObjects>` to learn more about working with UDTs.


.. _PageTypeSystem_Types_Void:

void
^^^^

There is a "void" type in Pine Script™. Functions having only side-effects and returning no usable result return the "void" type. 
An example of such a function is `alert() <https://www.tradingview.com/pine-script-reference/v5/#fun_alert>`__; 
it does something (triggers an alert event), but it returns no usable value.

Scripts cannot use "void" results in expressions or assign them to variables. No ``void`` keyword exists in Pine Script™ 
since one cannot declare a variable of the "void" type.



.. _PageTypeSystem_NaValue:

\`na\` value
------------

There is a special value in Pine Script™ called `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__, 
which is an acronym for *not available*. We use `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ to represent 
an undefined value from a variable or expression. It is similar to ``null`` in Java and ``None`` in Python.

Scripts can automatically cast `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ values to almost any 
type. However, in some cases, the compiler cannot infer the type associated with an 
`na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ value because more than one type-casting rule may apply. 
For example:

::

    // Compilation error!
    myVar = na

The above line of code causes a compilation error because the compiler cannot determine the nature of the ``myVar`` variable, 
i.e., whether the variable will reference numeric values for plotting, string values for setting text in a label, or 
other values for some other purpose later in the script's execution. 

To resolve such errors, we must explicitly declare the type associated with the variable. Suppose the ``myVar`` variable 
will reference "float" values in subsequent script iterations. We can resolve the error by declaring the variable with the 
`float <https://www.tradingview.com/pine-script-reference/v5/#type_float>`__ keyword:

::

    float myVar = na

or by explicitly casting the `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ value to the "float" type 
via the `float() <https://www.tradingview.com/pine-script-reference/v5/#fun_float>`__ function:

::

    myVar = float(na)

To test if the value from a variable or expression is `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__, 
we call the `na() <https://www.tradingview.com/pine-script-reference/v5/#fun_na>`__ function, which returns ``true`` if 
the value is undefined. For example:

::

    //@variable Is 0 if the `myVar` is `na`, `close` otherwise.
    float myClose = na(myVar) ? 0 : close

Do not use the ``==`` comparison operator to test for `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ 
values, as scripts cannot determine the equality of an undefined value:

::

    //@variable Returns the `close` value. The script cannot compare the equality of `na` values, as they're undefined.
    float myClose = myVar == na ? 0 : close

Best coding practices often involve handling `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ values 
to prevent undefined values in calculations. 

For example, this line of code checks if the `close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__ value 
on the current bar is greater than the previous bar's value:

::

    //@variable Is `true` when the `close` exceeds the last bar's `close`, `false` otherwise.
    bool risingClose = close > close[1]

On the first chart bar, the value of ``risingClose`` is `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ 
since there is no past `close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__ value to reference. 

We can ensure the expression also returns an actionable value on the first bar by replacing the undefined past value with a value 
from the current bar. This line of code uses the `nz() <https://www.tradingview.com/pine-script-reference/v5/#fun_nz>`__ 
function to replace the past bar's `close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__ 
with the current bar's `open <https://www.tradingview.com/pine-script-reference/v5/#var_open>`__ when the value is 
`na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__:

::

    //@variable Is `true` when the `close` exceeds the last bar's `close` (or the current `open` if the value is `na`).
    bool risingClose = close > nz(close[1], open)

Protecting scripts against `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ instances helps to prevent 
undefined values from propagating in a calculation's results. For example, this script declares an ``allTimeHigh`` variable 
on the first bar. It then uses the `math.max() <https://www.tradingview.com/pine-script-reference/v5/#fun_math.max>`__ between 
the ``allTimeHigh`` and the bar's `high <https://www.tradingview.com/pine-script-reference/v5/#var_high>`__ to update the 
``allTimeHigh`` throughout its execution:

.. code-block:: pine

    //@version=5
    indicator("na protection demo", overlay = true)

    //@variable The result of calculating the all-time high price with an initial value of `na`.
    var float allTimeHigh = na

    // Reassign the value of the `allTimeHigh`.
    // Returns `na` on all bars because `math.max()` can't compare the `high` to an undefined value.
    allTimeHigh := math.max(allTimeHigh, high)

    plot(allTimeHigh) // Plots `na` on all bars.

This script plots a value of `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ on all bars, as we have not 
included any `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ protection in the code. To fix the behavior 
and plot the intended result (i.e., the all-time high of the chart's prices), we can use 
`nz() <https://www.tradingview.com/pine-script-reference/v5/#fun_nz>`__ to replace `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ 
values in the ``allTimeHigh`` series:

.. code-block:: pine

    //@version=5
    indicator("na protection demo", overlay = true)

    //@variable The result of calculating the all-time high price with an initial value of `na`.
    var float allTimeHigh = na

    // Reassign the value of the `allTimeHigh`.
    // We've used `nz()` to prevent the initial `na` value from persisting throughout the calculation.
    allTimeHigh := math.max(nz(allTimeHigh), high)

    plot(allTimeHigh)



.. _PageTypeSystem_TypeTemplates:

Type templates
--------------

Type templates specify the data types that collections (:ref:`arrays <PageArrays>`, 
:ref:`matrices <PageMatrices>`, and :ref:`maps <PageMaps>`) can contain. 

Templates for :ref:`arrays <PageArrays>` and :ref:`matrices <PageMatrices>` consist 
of a single type identifier surrounded by angle brackets, e.g., 
``<int>``, ``<label>``, and ``<PivotPoint>`` (where ``PivotPoint`` is a 
:ref:`user-defined type (UDT) <PageTypeSystem_UserDefinedTypes>`). 

Templates for :ref:`maps <PageMaps>` consist of two type identifiers enclosed in angle brackets, 
where the first specifies the type of *keys* in each key-value pair, and the second specifies the *value* type. 
For example, ``<string, float>`` is a type template for a map that holds ``string`` keys and ``float`` values.

Users can construct type templates from:

- Fundamental types: :ref:`int <PageTypeSystem_Types_Int>`, :ref:`float <PageTypeSystem_Types_Float>`, 
  :ref:`bool <PageTypeSystem_Types_Bool>`, :ref:`color <PageTypeSystem_Types_Color>`, 
  and :ref:`string <PageTypeSystem_Types_String>`
- The following special types: :ref:`line <PageTypeSystem_Types_DrawingTypes>`, 
  :ref:`linefill <PageTypeSystem_Types_DrawingTypes>`, :ref:`box <PageTypeSystem_Types_DrawingTypes>`, 
  :ref:`polyline <PageTypeSystem_Types_DrawingTypes>`, :ref:`label <PageTypeSystem_Types_DrawingTypes>`, 
  :ref:`table <PageTypeSystem_Types_DrawingTypes>`, and 
  :ref:`chart.point <PageTypeSystem_Types_ChartPoints>`
- :ref:`User-defined types (UDTs) <PageTypeSystem_UserDefinedTypes>`

Note that:
 - :ref:`Maps <PageMaps>` can use any of these types as *values*, but they can only accept 
   fundamental types as *keys*. 

Scripts use type templates to declare variables that point to collections, 
and when creating new collection instances. For example:

.. code-block:: pine

    //@version=5
    indicator("Type templates demo")

    //@variable A variable initially assigned to `na` that accepts arrays of "int" values.
    array<int> intArray = na
    //@variable An empty matrix that holds "float" values.
    floatMatrix = matrix.new<float>()
    //@variable An empty map that holds "string" keys and "color" values.
    stringColorMap = map.new<string, color>()



.. _PageTypeSystem_TypeCasting:

Type casting
------------

Pine Script™ includes an automatic type-casting mechanism that *casts* (converts) **"int"** values to **"float"** when necessary. 
Variables or expressions requiring "float" values can also use "int" values because any integer can be represented 
as a floating point number with its fractional part equal to 0.

For the sake of backward compatibility, Pine Script™ also automatically casts **"int"** and **"float"** values to **"bool"** 
when necessary. When passing numeric values to the parameters of functions and operations that expect "bool" types, Pine 
auto-casts them to "bool". However, we do not recommend relying on this behavior. Most scripts that automatically 
cast numeric values to the "bool" type will produce a *compiler warning*. One can avoid the compiler warning and promote code 
readability by using the `bool() <https://www.tradingview.com/pine-script-reference/v5/#fun_bool>`__ function, which explicitly 
casts a numeric value to the "bool" type.

When casting an "int" or "float" to "bool", a value of 0 converts to ``false`` and any other numeric value always converts to ``true``.

This code below demonstrates deprecated auto-casting behavior in Pine. It creates a 
``randomValue`` variable with a "series float" value on every bar, which it passes to the ``condition`` 
parameter in an `if <https://www.tradingview.com/pine-script-reference/v5/#kw_if>`__ structure and the ``series`` parameter in a 
`plotchar() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotchar>`__ function call. Since both parameters accept 
"bool" values, the script automatically casts the ``randomValue`` to "bool" when evaluating them:

.. code-block:: pine

    //@version=5
    indicator("Auto-casting demo", overlay = true)

    //@variable A random rounded value between -1 and 1.
    float randomValue = math.round(math.random(-1, 1))
    //@variable The color of the chart background.
    color bgColor = na

    // This raises a compiler warning since `randomValue` is a "float", but `if` expects a "bool".
    if randomValue
        bgColor := color.new(color.blue, 60)
    // This does not raise a warning, as the `bool()` function explicitly casts the `randomValue` to "bool".
    if bool(randomValue)
        bgColor := color.new(color.blue, 60)

    // Display unicode characters on the chart based on the `randomValue`.
    // Whenever `math.random()` returns 0, no character will appear on the chart because 0 converts to `false`.
    plotchar(randomValue)
    // We recommend explicitly casting the number with the `bool()` function to make the type transformation more obvious.
    plotchar(bool(randomValue))

    // Highlight the background with the `bgColor`.
    bgcolor(bgColor)

It's sometimes necessary to cast one type to another when auto-casting rules do not suffice.
For such cases, the following type-casting functions are available: 
`int() <https://www.tradingview.com/pine-script-reference/v5/#fun_int>`__, 
`float() <https://www.tradingview.com/pine-script-reference/v5/#fun_float>`__, 
`bool() <https://www.tradingview.com/pine-script-reference/v5/#fun_bool>`__, 
`color() <https://www.tradingview.com/pine-script-reference/v5/#fun_color>`__, 
`string() <https://www.tradingview.com/pine-script-reference/v5/#fun_string>`__, 
`line() <https://www.tradingview.com/pine-script-reference/v5/#fun_line>`__, 
`linefill() <https://www.tradingview.com/pine-script-reference/v5/#fun_linefill>`__, 
`label() <https://www.tradingview.com/pine-script-reference/v5/#fun_label>`__, 
`box() <https://www.tradingview.com/pine-script-reference/v5/#fun_box>`__, and 
`table() <https://www.tradingview.com/pine-script-reference/v5/#fun_table>`__.

The example below shows a code that tries to use a "const float" value as the 
``length`` argument in the `ta.sma() <https://www.tradingview.com/pine-script-reference/v5/#fun_ta.sma>`__ 
function call. The script will fail to compile, as it cannot automatically convert 
the "float" value to the required "int" type:

.. code-block:: pine

    //@version=5
    indicator("Explicit casting demo", overlay = true)

    //@variable The length of the SMA calculation. Qualified as "const float".
    float LENGTH = 10.0

    float sma = ta.sma(close, LENGTH) // Compilation error. The `length` parameter requires an "int" value.

    plot(sma)

The code raises the following error:
*"Cannot call 'ta.sma' with argument 'length'='LENGTH'. An argument of 'const float' type was used but a 'series int' is expected."*

The compiler is telling us that the code is using a "float" value where an "int" is required. There is no auto-casting rule to cast a 
"float" to an "int", so we must do the job ourselves. In this version of the code, we've used the 
`int() <https://www.tradingview.com/pine-script-reference/v5/#fun_int>`__ function to explicitly convert our "float" ``LENGTH`` value to 
the "int" type within the `ta.sma() <https://www.tradingview.com/pine-script-reference/v5/#fun_ta.sma>`__ call:

.. code-block:: pine

    //@version=5
    indicator("explicit casting demo")

    //@variable The length of the SMA calculation. Qualified as "const float".
    float LENGTH = 10.0

    float sma = ta.sma(close, int(LENGTH)) // Compiles successfully since we've converted the `LENGTH` to "int".

    plot(sma)

Explicit type casting is also handy when declaring variables assigned to 
`na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__, as explained in the 
:ref:`previous section <PageTypeSystem_NaValue>`.

For example, once could explicitly declare a variable with a value of 
`na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ as a "label" type in 
either of the following, equivalent ways:

::

    // Explicitly specify that the variable references "label" objects:
    label myLabel = na

    // Explicitly cast the `na` value to the "label" type:
    myLabel = label(na)



.. _PageTypeSystem_Tuples:

Tuples
------

A *tuple* is a comma-separated set of expressions enclosed in brackets. When a 
function, :ref:`method <PageMethods>`, or other local block returns more than one value, 
scripts return those values in the form of a tuple. 

For example, the following :ref:`user-defined function <PageUserDefinedFunctions>` returns 
the sum and product of two "float" values:

::

    //@function Calculates the sum and product of two values.
    calcSumAndProduct(float a, float b) =>
        //@variable The sum of `a` and `b`.
        float sum = a + b
        //@variable The product of `a` and `b`.
        float product = a * b
        // Return a tuple containing the `sum` and `product`.
        [sum, product]

When we call this function later in the script, we use a *tuple declaration* to declare multiple 
variables corresponding to the values returned by the function call:

::

    // Declare a tuple containing the sum and product of the `high` and `low`, respectively.
    [hlSum, hlProduct] = calcSumAndProduct(high, low)

Keep in mind that unlike declaring single variables, we cannot explicitly define the types 
the tuple's variables (``hlSum`` and ``hlProduct`` in this case), will contain. The compiler 
automatically infers the types associated with the variables in a tuple.

In the above example, the resulting tuple contains values of the same type ("float"). However, 
it's important to note that tuples can contain values of *multiple types*. For example, the ``chartInfo()`` 
function below returns a tuple containing "int", "float", "bool", "color", and "string" values:

::

    //@function Returns information about the current chart.
    chartInfo() =>
        //@variable The first visible bar's UNIX time value.
        int firstVisibleTime = chart.left_visible_bar_time
        //@variable The `close` value at the `firstVisibleTime`.
        float firstVisibleClose = ta.valuewhen(ta.cross(time, firstVisibleTime), close, 0)
        //@variable Is `true` when using a standard chart type, `false` otherwise.
        bool isStandard = chart.is_standard
        //@variable The foreground color of the chart.
        color fgColor = chart.fg_color
        //@variable The ticker ID of the current chart.
        string symbol = syminfo.tickerid
        // Return a tuple containing the values. 
        [firstVisibleTime, firstVisibleClose, isStandard, fgColor, symbol]

Tuples are especially handy for requesting multiple values in one 
`request.security() <https://www.tradingview.com/pine-script-reference/v5/#fun_request.security>`__ call. 

For instance, this ``roundedOHLC()`` function returns a tuple containing OHLC values rounded to the nearest prices 
that are divisible by the symbol's `minimum tick <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo.mintick>`__ 
value. We call this function as the ``expression`` argument in 
`request.security() <https://www.tradingview.com/pine-script-reference/v5/#fun_request.security>`__ 
to request a tuple containing daily OHLC values:

::

    //@function Returns a tuple of OHLC values, rounded to the nearest tick.
    roundedOHLC() =>
        [math.round_to_mintick(open), math.round_to_mintick(high), math.round_to_mintick(low), math.round_to_mintick(close)]

    [op, hi, lo, cl] = request.security(syminfo.tickerid, "D", roundedOHLC())

We can also achieve the same result by directly passing a tuple of rounded values as the ``expression`` in the 
`request.security() <https://www.tradingview.com/pine-script-reference/v5/#fun_request.security>`__ call:

::

    [op, hi, lo, cl] = request.security(
         syminfo.tickerid, "D", 
         [math.round_to_mintick(open), math.round_to_mintick(high), math.round_to_mintick(low), math.round_to_mintick(close)]
     )


Local blocks of :ref:`conditional structures <PageConditionalStructures>`, including 
`if <https://www.tradingview.com/pine-script-reference/v5/#kw_if>`__ and 
`switch <https://www.tradingview.com/pine-script-reference/v5/#kw_switch>`__ statements, 
can return tuples. For example:

::

    [v1, v2] = if close > open
        [high, close]
    else
        [close, low]

and:

::

    [v1, v2] = switch 
    close > open => [high, close]
    =>              [close, low]

However, ternaries cannot contain tuples, as the return values in a ternary statement are not considered local blocks:

::

    // Not allowed.
    [v1, v2] = close > open ? [high, close] : [close, low]

Note that all items within a tuple returned from a function are qualified as "simple" or "series", depending on its contents. 
If a tuple contains a "series" value, all other elements within the tuple will also adopt the "series" qualifier. For example:

.. code-block:: pine

    //@version=5
    indicator("Qualified types in tuples demo")

    makeTicker(simple string prefix, simple string ticker) =>
        tId = prefix + ":" + ticker // simple string
        source = close  // series float
        [tId, source]

    // Both variables are series now. 
    [tId, source] = makeTicker("BATS", "AAPL") 

    // Error cannot call 'request.security' with 'series string' tId.
    r = request.security(tId, "", source)

    plot(r)



.. image:: /images/logo/TradingView_Logo_Block.svg
    :width: 200px
    :align: center
    :target: https://www.tradingview.com/
