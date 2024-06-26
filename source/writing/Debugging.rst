.. image:: /images/logo/Pine_Script_logo.svg
   :alt: Pine Script™ logo
   :target: https://www.tradingview.com/pine-script-docs/en/v5/Introduction.html
   :align: right
   :width: 100
   :height: 100


.. _PageDebugging:


Debugging
=========

.. contents:: :local:
    :depth: 3



Introduction
------------

TradingView's close integration between the Pine Editor and the chart interface facilitates efficient, 
interactive debugging of Pine Script™ code, as scripts can produce dynamic results in multiple locations, 
on and off the chart. Programmers can utilize such results to refine their script's behaviors and ensure 
everything works as expected. 

When a programmer understands the appropriate techniques for inspecting the variety of behaviors one may 
encounter while writing a script, they can quickly and thoroughly identify and resolve potential problems 
in their code, which allows for a more seamless overall coding experience. This page demonstrates some of the 
handiest ways to debug code when working with Pine Script™.

.. note::
   Before venturing further on this page, we recommend familiarizing yourself with Pine's 
   :ref:`Execution model <PageExecutionModel>` and :ref:`Type system <PageTypeSystem>`, as it's crucial 
   to understand these details when debugging in the Pine Script™ environment. 



.. _PageDebugging_TheLayOfTheLand:

The lay of the land
-------------------

Pine scripts can output their results in multiple different ways, any of which programmers can utilize 
for debugging.

The ``plot*()`` functions can display results in a chart pane, the script's status line, the price (y-axis) 
scale, and the Data Window, providing simple, convenient ways to debug numeric and conditional values:

.. image:: images/Debugging-The-lay-of-the-land-1.png

.. code-block:: pine

    //@version=5
    indicator("The lay of the land - Plots")

    // Plot the `bar_index` in all available locations.
    plot(bar_index, "bar_index", color.teal, 3)

Note that:
 - A script's status line outputs will only show when enabling the "Values" checkbox within the "Indicators" 
   section of the chart's "Status line" settings.
 - Price scales will only show plot values or names when enabling the options from the "Indicators and financials" 
   dropdown in the chart's "Scales and lines" settings. 

The `bgcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_bgcolor>`__ function displays 
colors in the script pane's background, and the 
`barcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_barcolor>`__ function changes the 
colors of the main chart's bars or candles. Both of these functions provide a simple way to visualize conditions: 

.. image:: images/Debugging-The-lay-of-the-land-2.png

.. code-block:: pine

    //@version=5
    indicator("The lay of the land - Background and bar colors")

    //@variable Is `true` if the `close` is rising over 2 bars.
    bool risingPrice = ta.rising(close, 2)

    // Highlight the chart background and color the main chart bars based on `risingPrice`.
    bgcolor(risingPrice ? color.new(color.green, 70) : na, title= "`risingPrice` highlight")
    barcolor(risingPrice ? color.aqua : chart.bg_color, title = "`risingPrice` bar color")

Pine's :ref:`drawing types <PageTypeSystem_Types_DrawingTypes>` (:ref:`line <PageLinesAndBoxes_Lines>`, 
:ref:`box <PageLinesAndBoxes_Boxes>`, :ref:`polyline <PageLinesAndBoxes_Polylines>`, 
:ref:`label <PageTextAndShapes_Labels>`, and :ref:`table <PageTables>`) produce drawings in the script's 
pane. While they don't return results in other locations, such as the status line or Data Window, they 
provide alternative, flexible solutions for inspecting numeric values, conditions, and strings directly 
on the chart:

.. image:: images/Debugging-The-lay-of-the-land-3.png

.. code-block:: pine

    //@version=5
    indicator("The lay of the land - Drawings", overlay = true)

    //@variable Is `true` when the time changes on the "1D" timeframe.
    bool newDailyBar = timeframe.change("1D")
    //@variable The previous bar's `bar_index` from when `newDailyBar` last occurred.
    int closedIndex = ta.valuewhen(newDailyBar, bar_index - 1, 0)
    //@variable The previous bar's `close` from when `newDailyBar` last occurred.
    float closedPrice = ta.valuewhen(newDailyBar, close[1], 0)

    if newDailyBar
        //@variable Draws a line from the previous `closedIndex` and `closedPrice` to the current values.
        line debugLine = line.new(closedIndex[1], closedPrice[1], closedIndex, closedPrice, width = 2)
        //@variable Variable info to display in a label.
        string debugText = "'1D' bar closed at: \n(" + str.tostring(closedIndex) + ", " + str.tostring(closedPrice) + ")"
        //@variable Draws a label at the current `closedIndex` and `closedPrice`.
        label.new(closedIndex, closedPrice, debugText, color = color.purple, textcolor = color.white)

The ``log.*()`` functions produce :ref:`Pine Logs <PageDebugging_PineLogs>` results. Every time a script 
calls any of these functions, the script logs a message in the :ref:`Pine Logs <PageDebugging_PineLogs>` 
pane, along with a timestamp and navigation options to identify the specific times, chart bars, and lines 
of code that triggered a log:

.. image:: images/Debugging-The-lay-of-the-land-4.png

.. code-block:: pine

    //@version=5
    indicator("The lay of the land - Pine Logs")

    //@variable The natural logarithm of the current `high - low` range.
    float logRange = math.log(high - low)

    // Plot the `logRange`.
    plot(logRange, "logRange")

    if barstate.isconfirmed
        // Generate an "error" or "info" message on the confirmed bar, depending on whether `logRange` is defined.
        switch 
            na(logRange) => log.error("Undefined `logRange` value.")
            =>              log.info("`logRange` value: " + str.tostring(logRange))
    else
        // Generate a "warning" message for unconfirmed values.
        log.warning("Unconfirmed `logRange` value: " + str.tostring(logRange))

One can apply any of the above, or a combination, to establish debugging routines to fit their needs and 
preferences, depending on the data types and structures they're working with. See the sections below for 
detailed explanations of various debugging techniques.



.. _PageDebugging_NumericValues:

Numeric values
--------------

When creating code in Pine Script™, working with numbers is inevitable. Therefore, to ensure a script 
works as intended, it's crucial to understand how to inspect the numeric (:ref:`int <PageTypeSystem_Types_Int>` 
and :ref:`float <PageTypeSystem_Types_Float>`) values it receives and calculates.

.. note::
   This section discusses fundamental *chart-based* approaches for debugging numbers. Scripts can also 
   convert numbers to :ref:`strings <PageTypeSystem_Types_String>`, allowing one to inspect numbers 
   using string-related techniques. For more information, see the :ref:`Strings <PageDebugging_Strings>` 
   and :ref:`Pine Logs <PageDebugging_PineLogs>` sections.


.. _PageDebugging_NumericValues_PlottingNumbers:

Plotting numbers
^^^^^^^^^^^^^^^^

One of the most straightforward ways to inspect a script's numeric values is to use ``plot*()`` 
functions, which can display results graphically on the chart and show formatted numbers in the script's 
status line, the price scale, and the Data Window. The locations where a ``plot*()`` function displays 
its results depend on the ``display`` parameter. By default, its value is 
`display.all <https://www.tradingview.com/pine-script-reference/v5/#const_display.all>`__.

.. note::
   Only a script's *global scope* can contain ``plot*()`` calls, meaning these functions can only accept 
   global variables and literals. They cannot use variables declared from the local scopes of 
   :ref:`loops <PageLoops>`, :ref:`conditional structures <PageConditionalStructures>`, or 
   :ref:`user-defined functions <PageUserDefinedFunctions>` and :ref:`methods <PageMethods_UserDefinedMethods>`. 

The following example uses the `plot() <https://www.tradingview.com/pine-script-reference/v5/#fun_plot>`__ 
function to display the 1-bar change in the value of the built-in 
`time <https://www.tradingview.com/pine-script-reference/v5/#var_time>`__ variable measured in chart timeframes 
(e.g., a plotted value of 1 on the "1D" chart means there is a one-day difference between the opening times of 
the current and previous bars). Inspecting this series can help to identify time gaps in a chart's data, which 
is helpful information when designing time-based indicators. 

Since we have not specified a ``display`` argument, the function uses 
`display.all <https://www.tradingview.com/pine-script-reference/v5/#const_display.all>`__, meaning it will show 
data in *all* possible locations, as we see below:

.. image:: images/Debugging-Numeric-values-Plotting-numbers-1.png

.. code-block:: pine

    //@version=5
    indicator("Plotting numbers demo", "Time changes")

    //@variable The one-bar change in the chart symbol's `time` value, measured in units of the chart timeframe.
    float timeChange = ta.change(time) / (1000.0 * timeframe.in_seconds())

    // Display the `timeChange` in all possible locations.
    plot(timeChange, "Time difference (in chart bar units)", color.purple, 3)

Note that:
 - The numbers displayed in the script's status line and the Data Window reflect the plotted values at the 
   location of the chart's cursor. These areas will show the latest bar's value when the mouse pointer 
   isn't on the chart. 
 - The number in the price scale reflects the latest available value on the visible chart.

.. _PageDebugging_NumericValues_PlottingNumbers_WithoutAffectingTheScale:

Without affecting the scale
~~~~~~~~~~~~~~~~~~~~~~~~~~~

When debugging multiple numeric values in a script, programmers may wish to inspect them without interfering with 
the price scales or cluttering the visual outputs in the chart's pane, as distorted scales and overlapping plots 
may make it harder to evaluate the results. 

A simple way to inspect numbers without adding more visuals to the chart's pane is to change the ``display`` values 
in the script's ``plot*()`` calls to other ``display.*`` variables or expressions using them. 

Let's look at a practical example. Here, we've drafted the following script that calculates a custom-weighted moving 
average by dividing the `sum <https://www.tradingview.com/pine-script-reference/v5/#fun_math.sum>`__ of 
``weight * close`` values by the `sum <https://www.tradingview.com/pine-script-reference/v5/#fun_math.sum>`__ of 
the ``weight`` series:

.. image:: images/Debugging-Numeric-values-Plotting-numbers-Without-affecting-the-scale-1.png

.. code-block:: pine

    //@version=5
    indicator("Plotting without affecting the scale demo", "Weighted Average", true)

    //@variable The number of bars in the average.
    int lengthInput = input.int(20, "Length", 1)

    //@variable The weight applied to the price on each bar.
    float weight = math.pow(close - open, 2)

    //@variable The numerator of the average.
    float numerator = math.sum(weight * close, lengthInput)
    //@variable The denominator of the average.
    float denominator = math.sum(weight, lengthInput)

    //@variable The `lengthInput`-bar weighted average.
    float average = numerator / denominator

    // Plot the `average`.
    plot(average, "Weighted Average", linewidth = 3)

Suppose we'd like to inspect the variables used in the ``average`` calculation to understand and fine-tune the result. 
If we were to use `plot() <https://www.tradingview.com/pine-script-reference/v5/#fun_plot>`__ to display the script's 
``weight``, ``numerator``, and ``denominator`` in all locations, we can no longer easily identify our ``average`` line 
on the chart since each variable has a radically different scale: 

.. image:: images/Debugging-Numeric-values-Plotting-numbers-Without-affecting-the-scale-2.png

.. code-block:: pine

    //@version=5
    indicator("Plotting without affecting the scale demo", "Weighted Average", true)

    //@variable The number of bars in the average.
    int lengthInput = input.int(20, "Length", 1)

    //@variable The weight applied to the price on each bar.
    float weight = math.pow(close - open, 2)

    //@variable The numerator of the average.
    float numerator = math.sum(close * weight, lengthInput)
    //@variable The denominator of the average.
    float denominator = math.sum(weight, lengthInput)

    //@variable The `lengthInput`-bar weighted average.
    float average = numerator / denominator

    // Plot the `average`.
    plot(average, "Weighted Average", linewidth = 3)

    // Create debug plots for the `weight`, `numerator`, and `denominator`.
    plot(weight, "weight", color.purple)
    plot(numerator, "numerator", color.teal)
    plot(denominator, "denominator", color.maroon)

While we could hide individual plots from the "Style" tab of the script's settings, doing so also prevents us from 
inspecting the results in any other location. To simultaneously view the variables' values and preserve the scale 
of our chart, we can change the ``display`` values in our debug plots. 

The version below includes a ``debugLocations`` variable in the debug 
`plot() <https://www.tradingview.com/pine-script-reference/v5/#fun_plot>`__ calls with a value of 
``display.all - display.pane`` to specify that all locations *except* the chart pane will show the results. 
Now we can inspect the calculation's values without the extra clutter:

.. image:: images/Debugging-Numeric-values-Plotting-numbers-Without-affecting-the-scale-3.png

.. code-block:: pine

    //@version=5
    indicator("Plotting without affecting the scale demo", "Weighted Average", true)

    //@variable The number of bars in the average.
    int lengthInput = input.int(20, "Length", 1)

    //@variable The weight applied to the price on each bar.
    float weight = math.pow(close - open, 2)

    //@variable The numerator of the average.
    float numerator = math.sum(close * weight, lengthInput)
    //@variable The denominator of the average.
    float denominator = math.sum(weight, lengthInput)

    //@variable The `lengthInput`-bar weighted average.
    float average = numerator / denominator

    // Plot the `average`.
    plot(average, "Weighted Average", linewidth = 3)

    //@variable The display locations of all debug plots.
    debugLocations = display.all - display.pane
    // Create debug plots for the `weight`, `numerator`, and `denominator`.
    plot(weight, "weight", color.purple, display = debugLocations)
    plot(numerator, "numerator", color.teal, display = debugLocations)
    plot(denominator, "denominator", color.maroon, display = debugLocations)

.. _PageDebugging_NumericValues_PlottingNumbers_FromLocalScopes:

From local scopes
~~~~~~~~~~~~~~~~~

A script's *local scopes* are sections of indented code within :ref:`conditional structures <PageConditionalStructures>`, 
:ref:`loops <PageLoops>`, :ref:`functions <PageUserDefinedFunctions>`, and :ref:`methods <PageMethods_UserDefinedMethods>`. 
When working with variables declared within these scopes, using the ``plot*()`` functions to display their values 
directly *will not* work, as plots only work with literals and *global* variables. 

To display a local variable's values using plots, one can assign its results to a global variable and pass that 
variable to the ``plot*()`` call. 

.. note::
   The approach described below works for local variables declared within :ref:`conditional structures <PageConditionalStructures>` 
   and :ref:`loops <PageLoops>`. Employing a similar process for :ref:`functions <PageUserDefinedFunctions>` and 
   :ref:`methods <PageMethods_UserDefinedMethods>` requires :ref:`collections <PageTypeSystem_Types_Collections>`, 
   :ref:`user-defined types <PageTypeSystem_UserDefinedTypes>`, or other built-in reference types. See the 
   :ref:`Debugging functions <PageDebugging_DebuggingFunctions>` section for more information. 

For example, this script calculates the all-time maximum and minimum change in the 
`close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__ price over a ``lengthInput`` period. 
It uses an `if <https://www.tradingview.com/pine-script-reference/v5/#kw_if>`__ structure to declare a local ``change`` 
variable and update the global ``maxChange`` and ``minChange`` once every ``lengthInput`` bars:

.. image:: images/Debugging-Numeric-values-Plotting-numbers-From-local-scopes-1.png

.. code-block:: pine

    //@version=5
    indicator("Plotting numbers from local scopes demo", "Periodic changes")

    //@variable The number of chart bars in each period.
    int lengthInput = input.int(20, "Period length", 1)

    //@variable The maximum `close` change over each `lengthInput` period on the chart.
    var float maxChange = na
    //@variable The minimum `close` change over each `lengthInput` period on the chart.
    var float minChange = na

    //@variable Is `true` once every `lengthInput` bars.
    bool periodClose = bar_index % lengthInput == 0

    if periodClose
        //@variable The change in `close` prices over `lengthInput` bars.
        float change = close - close[lengthInput]
        // Update the global `maxChange` and `minChange`.
        maxChange := math.max(nz(maxChange, change), change)
        minChange := math.min(nz(minChange, change), change)

    // Plot the `maxChange` and `minChange`.
    plot(maxChange, "Max periodic change", color.teal, 3)
    plot(minChange, "Min periodic change", color.maroon, 3)
    hline(0.0, color = color.gray, linestyle = hline.style_solid)

Suppose we want to inspect the history of the ``change`` variable using a plot. While we cannot plot the variable 
directly since the script declares it in a local scope, we can assign its value to another *global* variable for 
use in a ``plot*()`` function.

Below, we've added a ``debugChange`` variable with an initial value of 
`na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ to the global scope, and the script reassigns 
its value within the `if <https://www.tradingview.com/pine-script-reference/v5/#kw_if>`__ structure using the local 
``change`` variable. Now, we can use `plot() <https://www.tradingview.com/pine-script-reference/v5/#fun_plot>`__ 
with the ``debugChange`` variable to view the history of available ``change`` values: 

.. image:: images/Debugging-Numeric-values-Plotting-numbers-From-local-scopes-2.png

.. code-block:: pine

    //@version=5
    indicator("Plotting numbers from local scopes demo", "Periodic changes")

    //@variable The number of chart bars in each period.
    int lengthInput = input.int(20, "Period length", 1)

    //@variable The maximum `close` change over each `lengthInput` period on the chart.
    var float maxChange = na
    //@variable The minimum `close` change over each `lengthInput` period on the chart.
    var float minChange = na

    //@variable Is `true` once every `lengthInput` bars.
    bool periodClose = bar_index % lengthInput == 0

    //@variable Tracks the history of the local `change` variable.
    float debugChange = na

    if periodClose
        //@variable The change in `close` prices over `lengthInput` bars.
        float change = close - close[lengthInput]
        // Update the global `maxChange` and `minChange`.
        maxChange := math.max(nz(maxChange, change), change)
        minChange := math.min(nz(minChange, change), change)
        // Assign the `change` value to the `debugChange` variable.
        debugChange := change

    // Plot the `maxChange` and `minChange`.
    plot(maxChange, "Max periodic change", color.teal, 3)
    plot(minChange, "Min periodic change", color.maroon, 3)
    hline(0.0, color = color.gray, linestyle = hline.style_solid)

    // Create a debug plot to visualize the `change` history.
    plot(debugChange, "Extracted change", color.purple, 15, plot.style_areabr)

Note that:
 - The script uses `plot.style_areabr <https://www.tradingview.com/pine-script-reference/v5/#const_plot.style_areabr>`__ 
   in the debug plot, which doesn't bridge over `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ 
   values as the default style does.
 - When the rightmost visible bar's plotted value is `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ 
   the number in the price scale represents the latest *non-na* value before that bar, if one exists.


.. _PageDebugging_NumericValues_WithDrawings:

With drawings
^^^^^^^^^^^^^

An alternative approach to graphically inspecting the history of a script's numeric values is to use Pine's 
:ref:`drawing types <PageTypeSystem_Types_DrawingTypes>`, including :ref:`lines <PageLinesAndBoxes_Lines>`, 
:ref:`boxes <PageLinesAndBoxes_Boxes>`, :ref:`polylines <PageLinesAndBoxes_Polylines>`, and 
:ref:`labels <PageTextAndShapes_Labels>`. 

While Pine drawings don't display results anywhere other than the chart pane, scripts can create them from 
within *local scopes*, including the scopes of :ref:`functions <PageUserDefinedFunctions>` and 
:ref:`methods <PageMethods_UserDefinedMethods>` (see the :ref:`Debugging functions <PageDebugging_DebuggingFunctions>` 
section to learn more). Additionally, scripts can position drawings at *any* available chart location, 
irrespective of the current `bar_index <https://www.tradingview.com/pine-script-reference/v5/#var_bar_index>`__.

For example, let's revisit the "Periodic changes" script from the 
:ref:`previous section <PageDebugging_NumericValues_PlottingNumbers_FromLocalScopes>`. Suppose we'd like to 
inspect the history of the local ``change`` variable *without* using a plot. In this case, we can avoid declaring 
a separate global variable and instead create drawing objects directly from the 
`if <https://www.tradingview.com/pine-script-reference/v5/#kw_if>`__ structure's local scope. 

The script below is a modification of the previous script that uses :ref:`boxes <PageLinesAndBoxes_Boxes>` to 
visualize the ``change`` variable's behavior. Inside the scope of the 
`if <https://www.tradingview.com/pine-script-reference/v5/#kw_if>`__ structure, it calls 
`box.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_box.new>`__ to create a 
`box <https://www.tradingview.com/pine-script-reference/v5/#type_box>`__ that spans from the bar ``lengthInput`` 
bars ago to the current `bar_index <https://www.tradingview.com/pine-script-reference/v5/#var_bar_index>`__:

.. image:: images/Debugging-Numeric-values-With-drawings-1.png

.. code-block:: pine

    //@version=5
    indicator("Drawing numbers from local scopes demo", "Periodic changes", max_boxes_count = 500)

    //@variable The number of chart bars in each period.
    int lengthInput = input.int(20, "Period length", 1)

    //@variable The maximum `close` change over each `lengthInput` period on the chart.
    var float maxChange = na
    //@variable The minimum `close` change over each `lengthInput` period on the chart.
    var float minChange = na

    //@variable Is `true` once every `lengthInput` bars.
    bool periodClose = bar_index % lengthInput == 0

    if periodClose
        //@variable The change in `close` prices over `lengthInput` bars.
        float change = close - close[lengthInput]
        // Update the global `maxChange` and `minChange`.
        maxChange := math.max(nz(maxChange, change), change)
        minChange := math.min(nz(minChange, change), change)
        //@variable Draws a box on the chart to visualize the `change` value.
        box debugBox = box.new(
             bar_index - lengthInput, math.max(change, 0.0), bar_index, math.min(change, 0.0),
             color.purple, bgcolor = color.new(color.purple, 80), text = str.tostring(change)
         )

    // Plot the `maxChange` and `minChange`.
    plot(maxChange, "Max periodic change", color.teal, 3)
    plot(minChange, "Min periodic change", color.maroon, 3)
    hline(0.0, color = color.gray, linestyle = hline.style_solid)

Note that:
 - The script includes ``max_boxes_count = 500`` in the 
   `indicator() <https://www.tradingview.com/pine-script-reference/v5/#fun_indicator>`__ function, which allows 
   it to show up to 500 :ref:`boxes <PageLinesAndBoxes_Boxes>` on the chart. 
 - We used `math.max(change, 0.0) <https://www.tradingview.com/pine-script-reference/v5/#fun_math.max>`__ and 
   `math.min(change, 0.0) <https://www.tradingview.com/pine-script-reference/v5/#fun_math.min>`__ in the 
   `box.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_box.new>`__ function as the ``top`` 
   and ``bottom`` values.
 - The `box.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_box.new>`__ call includes 
   `str.tostring(change) <https://www.tradingview.com/pine-script-reference/v5/#fun_str.tostring>`__ 
   as its ``text`` argument to display a *"string" representation* of the ``change`` variable's "float" value in each
   `box <https://www.tradingview.com/pine-script-reference/v5/#type_box>`__ drawing. See 
   :ref:`this <PageDebugging_Strings_RepresentingOtherTypes>` portion of the :ref:`Strings <PageDebugging_Strings>` 
   section below to learn more about representing data with strings. 

For more information about using :ref:`boxes <PageLinesAndBoxes_Boxes>` and other related 
:ref:`drawing types <PageTypeSystem_Types_DrawingTypes>`, see our User Manual's 
:ref:`Lines and boxes <PageLinesAndBoxes>` page.



.. _PageDebugging_Conditions:

Conditions
----------

Many scripts one will create in Pine involve declaring and evaluating *conditions* to dictate specific script 
actions, such as triggering different calculation patterns, visuals, signals, alerts, strategy orders, etc. As 
such, it's imperative to understand how to inspect the conditions a script uses to ensure proper execution.

.. note::
   This section discusses debugging techniques based on chart visuals. To learn about *logging* conditions, see the 
   :ref:`Pine Logs <PageDebugging_PineLogs>` section below.


.. _PageDebugging_Conditions_AsNumbers:

As numbers
^^^^^^^^^^

One possible way to debug a script's conditions is to define *numeric values* based on them, which allows programmers 
to inspect them using numeric approaches, such as those outlined in the :ref:`previous section <PageDebugging_NumericValues>`. 

Let's look at a simple example. This script calculates the ratio between the 
`ohlc4 <https://www.tradingview.com/pine-script-reference/v5/#var_ohlc4>`__ price and the ``lengthInput``-bar 
`moving average <https://www.tradingview.com/pine-script-reference/v5/#fun_ta.sma>`__. It assigns a condition to the 
``priceAbove`` variable that returns ``true`` whenever the value of the ratio exceeds 1 (i.e., the price is above the average). 

To inspect the occurrences of the condition, we created a ``debugValue`` variable assigned to the result of an expression 
that uses the ternary `?: <https://www.tradingview.com/pine-script-reference/v5/#op_?:>`__ operator to return 1 when 
``priceAbove`` is ``true`` and 0 otherwise. The script plots the variable's value in all available locations:

.. image:: images/Debugging-Conditions-As-numbers-1.png

.. code-block:: pine

    //@version=5
    indicator("Conditions as numbers demo", "MA signal")

    //@variable The number of bars in the moving average calculation.
    int lengthInput = input.int(20, "Length", 1)

    //@variable The ratio of the `ohlc4` price to its `lengthInput`-bar moving average.
    float ratio = ohlc4 / ta.sma(ohlc4, lengthInput)

    //@variable The condition to inspect. Is `true` when `ohlc4` is above its moving average, `false` otherwise.
    bool priceAbove = ratio > 1.0
    //@variable Returns 1 when the `priceAbove` condition is `true`, 0 otherwise.
    int debugValue = priceAbove ? 1 : 0

    // Plot the `debugValue.
    plot(debugValue, "Conditional number", color.teal, 3)

Note that:
 - Representing "bool" values using numbers also allows scripts to display conditional shapes or characters at specific y-axis 
   locations with `plotshape() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotshape>`__ and 
   `plotchar() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotchar>`__, and it facilitates conditional debugging 
   with `plotarrow() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotarrow>`__. See the 
   :ref:`next section <PageDebugging_Conditions_PlottingConditionalShapes>` to learn more. 


.. _PageDebugging_Conditions_PlottingConditionalShapes:

Plotting conditional shapes
^^^^^^^^^^^^^^^^^^^^^^^^^^^

The `plotshape() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotshape>`__ and 
`plotchar() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotchar>`__ functions provide utility for 
debugging conditions, as they can plot shapes or characters at absolute or relative chart locations whenever they 
contain a ``true`` or non-na ``series`` argument. 

These functions can also display *numeric* representations of the ``series`` in the script's status line and the 
Data Window, meaning they're also helpful for debugging :ref:`numbers <PageDebugging_NumericValues>`. We show a 
simple, practical way to debug numbers with these functions in the :ref:`Tips <PageDebugging_Tips>` section. 

The chart locations of the plots depend on the ``location`` parameter, which is 
`location.abovebar <https://www.tradingview.com/pine-script-reference/v5/#const_location.abovebar>`__ by default. 

.. note::
   When using `location.abovebar <https://www.tradingview.com/pine-script-reference/v5/#const_location.abovebar>`__ 
   or `location.belowbar <https://www.tradingview.com/pine-script-reference/v5/#const_location.belowbar>`__, the 
   function positions the shapes/characters relative to the *main chart* prices. If the script plots its values in 
   a separate chart pane, we recommend debugging with other ``location`` options to avoid affecting the pane's scale.

Let's inspect a condition using these functions. The following script calculates an 
`RSI <https://www.tradingview.com/pine-script-reference/v5/#fun_ta.rsi>`__ with a ``lengthInput`` length and a 
``crossBelow`` variable whose value is the result of a condition that returns ``true`` when the RSI crosses below 30. 
It calls `plotshape() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotshape>`__ to display a circle near the 
top of the pane each time the condition occurs:

.. image:: images/Debugging-Conditions-Plotting-conditional-shapes-1.png

.. code-block:: pine

    //@version=5
    indicator("Conditional shapes demo", "RSI cross under 30")

    //@variable The length of the RSI.
    int lengthInput = input.int(14, "Length", 1)

    //@variable The calculated RSI value.
    float rsi = ta.rsi(close, lengthInput)

    //@variable Is `true` when the `rsi` crosses below 30, `false` otherwise.
    bool crossBelow = ta.crossunder(rsi, 30.0)

    // Plot the `rsi`.
    plot(rsi, "RSI", color.rgb(136, 76, 146), linewidth = 3)
    // Plot the `crossBelow` condition as circles near the top of the pane.
    plotshape(crossBelow, "RSI crossed below 30", shape.circle, location.top, color.red, size = size.small)

Note that:
 - The status line and Data Window show a value of 1 when ``crossBelow`` is ``true`` and 0 when it's ``false``.

Suppose we'd like to display the shapes at *precise* locations rather than relative to the chart pane. We can achieve 
this by using :ref:`conditional numbers <PageDebugging_Conditions_AsNumbers>` and 
`location.absolute <https://www.tradingview.com/pine-script-reference/v5/#const_location.absolute>`__ in the 
`plotshape() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotshape>`__ call. 

In this example, we've modified the previous script by creating a ``debugNumber`` variable that returns the ``rsi`` 
value when ``crossBelow`` is ``true`` and `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ otherwise. 
The `plotshape() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotshape>`__ function uses this new variable 
as its ``series`` argument and `location.absolute <https://www.tradingview.com/pine-script-reference/v5/#const_location.absolute>`__ 
as its ``location`` argument:

.. image:: images/Debugging-Conditions-Plotting-conditional-shapes-2.png

.. code-block:: pine

    //@version=5
    indicator("Conditional shapes demo", "RSI cross under 30")

    //@variable The length of the RSI.
    int lengthInput = input.int(14, "Length", 1)

    //@variable The calculated RSI value.
    float rsi = ta.rsi(close, lengthInput)

    //@variable Is `true` when the `rsi` crosses below 30, `false` otherwise.
    bool crossBelow = ta.crossunder(rsi, 30.0)
    //@variable Returns the `rsi` when `crossBelow` is `true`, `na` otherwise.
    float debugNumber = crossBelow ? rsi : na

    // Plot the `rsi`.
    plot(rsi, "RSI", color.rgb(136, 76, 146), linewidth = 3)
    // Plot circles at the `debugNumber`.
    plotshape(debugNumber, "RSI when it crossed below 30", shape.circle, location.absolute, color.red, size = size.small)

Note that:
 - Since we passed a *numeric* series to the function, our conditional plot now shows the values of the ``debugNumber`` 
   in the status line and Data Window instead of 1 or 0.

Another handy way to debug conditions is to use `plotarrow() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotarrow>`__. 
This function plots an arrow with a location relative to the *main chart prices* whenever the ``series`` argument is nonzero 
and not `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__. The length of each arrow varies with the ``series`` 
value supplied. As with `plotshape() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotshape>`__ and 
`plotchar() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotchar>`__, 
`plotarrow() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotarrow>`__ can also display numeric results in the 
status line and the Data Window.

.. note::
   Since this function always positions arrows relative to the main chart prices, we recommend only using it if the script 
   occupies the main chart pane to avoid otherwise interfering with the scale.

This example shows an alternative way to inspect our ``crossBelow`` condition using 
`plotarrow() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotarrow>`__. In this version, we've set ``overlay`` 
to ``true`` in the `indicator() <https://www.tradingview.com/pine-script-reference/v5/#fun_indicator>`__ function and added a 
`plotarrow() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotarrow>`__ call to visualize the conditional values. 
The ``debugNumber`` in this example measures how far the ``rsi`` dropped below 30 each time the condition occurs:

.. image:: images/Debugging-Conditions-Plotting-conditional-shapes-3.png

.. code-block:: pine

    //@version=5
    indicator("Conditional shapes demo", "RSI cross under 30", true)

    //@variable The length of the RSI.
    int lengthInput = input.int(14, "Length", 1)

    //@variable The calculated RSI value.
    float rsi = ta.rsi(close, lengthInput)

    //@variable Is `true` when the `rsi` crosses below 30, `false` otherwise.
    bool crossBelow = ta.crossunder(rsi, 30.0)
    //@variable Returns `rsi - 30.0` when `crossBelow` is `true`, `na` otherwise.
    float debugNumber = crossBelow ? rsi - 30.0 : na

    // Plot the `rsi`.
    plot(rsi, "RSI", color.rgb(136, 76, 146), display = display.data_window)
    // Plot circles at the `debugNumber`.
    plotarrow(debugNumber, "RSI cross below 30 distnce")

Note that:
 - We set the ``display`` value in the `plot() <https://www.tradingview.com/pine-script-reference/v5/#fun_plot>`__ 
   of the ``rsi`` to `display.data_window <https://www.tradingview.com/pine-script-reference/v5/#const_display.data_window>`__ 
   to :ref:`preserve the chart's scale <PageDebugging_NumericValues_PlottingNumbers_WithoutAffectingTheScale>`.

To learn more about `plotshape() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotshape>`__, 
`plotchar() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotchar>`__, and 
`plotarrow() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotarrow>`__, see this manual's 
:ref:`Text and shapes <PageTextAndShapes>` page.


.. _PageDebugging_Conditions_ConditionalColors:

Conditional colors
^^^^^^^^^^^^^^^^^^

An elegant way to visually represent conditions in Pine is to create expressions that return 
:ref:`color <PageTypeSystem_Types_Color>` values based on ``true`` or ``false`` states, as scripts can use them to 
control the appearance of :ref:`drawing objects <PageTypeSystem_Types_DrawingTypes>` or the results of ``plot*()``, 
`fill() <https://www.tradingview.com/pine-script-reference/v5/#fun_fill>`__, 
`bgcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_bgcolor>`__, or 
`barcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_barcolor>`__ calls.

.. note::
   As with ``plot*()`` functions, scripts can only call `fill() <https://www.tradingview.com/pine-script-reference/v5/#fun_fill>`__, 
   `bgcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_bgcolor>`__ and 
   `barcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_barcolor>`__ from the *global scope*, and 
   the functions cannot accept any local variables. 

For example, this script calculates the change in `close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__ 
prices over ``lengthInput`` bars and declares two "bool" variables to identify when the price change is positive or negative. 

The script uses these "bool" values as conditions in `ternary <https://www.tradingview.com/pine-script-reference/v5/#op_?:>`__ 
expressions to assign the values of three "color" variables, then uses those variables as the ``color`` arguments in 
`plot() <https://www.tradingview.com/pine-script-reference/v5/#fun_plot>`__, 
`bgcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_bgcolor>`__, and 
`barcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_barcolor>`__ to debug the results:

.. image:: images/Debugging-Conditions-Conditional-colors-1.png

.. code-block:: pine

    //@version=5
    indicator("Conditional colors demo", "Price change colors")

    //@variable The number of bars in the price change calculation.
    int lengthInput = input.int(10, "Length", 1)

    //@variable The change in `close` prices over `lengthInput` bars.
    float priceChange = ta.change(close, lengthInput)

    //@variable Is `true` when the `priceChange` is a positive value, `false` otherwise.
    bool isPositive = priceChange > 0
    //@variable Is `true` when the `priceChange` is a negative value, `false` otherwise.
    bool isNegative = priceChange < 0

    //@variable Returns a color for the `priceChange` plot to show when `isPositive`, `isNegative`, or neither occurs.
    color plotColor = isPositive ? color.teal : isNegative ? color.maroon : chart.fg_color
    //@variable Returns an 80% transparent color for the background when `isPositive` or `isNegative`, `na` otherwise.
    color bgColor = isPositive ? color.new(color.aqua, 80) : isNegative ? color.new(color.fuchsia, 80) : na
    //@variable Returns a color to emphasize chart bars when `isPositive` occurs. Otherwise, returns the `chart.bg_color`.
    color barColor = isPositive ? color.orange : chart.bg_color

    // Plot the `priceChange` and color it with the `plotColor`.
    plot(priceChange, "Price change", plotColor, style = plot.style_area)
    // Highlight the pane's background with the `bgColor`.
    bgcolor(bgColor, title = "Background highlight")
    // Emphasize the chart bars with positive price change using the `barColor`.
    barcolor(barColor, title = "Positive change bars")

Note that:
 - The `barcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_barcolor>`__ function always colors the 
   main chart's bars, regardless of whether the script occupies another chart pane, and the chart will only display the 
   results if the bars are visible. 

See the :ref:`Colors <PageColors>`, :ref:`Fills <PageFills>`, :ref:`Backgrounds <PageBackgrounds>`, and 
:ref:`Bar coloring <PageBarColoring>` pages for more information about working with colors, filling plots, highlighting 
backgrounds, and coloring bars. 


.. _PageDebugging_Conditions_UsingDrawings:

Using drawings
^^^^^^^^^^^^^^

Pine Script™'s :ref:`drawing types <PageTypeSystem_Types_DrawingTypes>` provide flexible ways to visualize conditions on 
the chart, especially when the conditions are within local scopes.  

Consider the following script, which calculates a custom ``filter`` with a smoothing parameter (``alpha``) that changes 
its value within an `if <https://www.tradingview.com/pine-script-reference/v5/#kw_if>`__ structure based on recent 
`volume <https://www.tradingview.com/pine-script-reference/v5/#var_volume>`__ conditions:

.. image:: images/Debugging-Conditions-Using-drawings-1.png

.. code-block:: pine

    //@version=5
    indicator("Conditional drawings demo", "Volume-based filter", true)

    //@variable The number of bars in the volume average.
    int lengthInput = input.int(20, "Volume average length", 1)

    //@variable The average `volume` over `lengthInput` bars.
    float avgVolume = ta.sma(volume, lengthInput)

    //@variable A custom price filter based on volume activity.
    float filter = close
    //@variable The smoothing parameter of the filter calculation. Its value depends on multiple volume conditions.
    float alpha = na

    // Set the `alpha` to 1 if `volume` exceeds its `lengthInput`-bar moving average.
    if volume > avgVolume
        alpha := 1.0
    // Set the `alpha` to 0.5 if `volume` exceeds its previous value.
    else if volume > volume[1]
        alpha := 0.5
    // Set the `alpha` to 0.01 otherwise.
    else
        alpha := 0.01

    // Calculate the new `filter` value.
    filter := (1.0 - alpha) * nz(filter[1], filter) + alpha * close

    // Plot the `filter`.
    plot(filter, "Filter", linewidth = 3)

Suppose we'd like to inspect the conditions that control the ``alpha`` value. There are several ways we could approach 
the task with chart visuals. However, some approaches will involve more code and careful handling. 

For example, to visualize the `if <https://www.tradingview.com/pine-script-reference/v5/#kw_if>`__ structure's conditions 
using :ref:`plotted shapes <PageDebugging_Conditions_PlottingConditionalShapes>` or 
:ref:`background colors <PageDebugging_Conditions_ConditionalColors>`, we'd have to create additional variables or 
expressions in the global scope for the ``plot*()`` or `bgcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_bgcolor>`__ 
functions to access. 

Alternatively, we can use :ref:`drawing types <PageTypeSystem_Types_DrawingTypes>` to visualize the conditions concisely 
without those extra steps. 

The following is a modification of the previous script that calls 
`label.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_label.new>`__ within specific branches of the 
:ref:`conditional structure <PageConditionalStructures>` to draw :ref:`labels <PageTextAndShapes_Labels>` on the chart 
whenever those branches execute. These simple changes allow us to identify those conditions on the chart without much extra code: 

.. image:: images/Debugging-Conditions-Using-drawings-2.png

.. code-block:: pine

    //@version=5
    indicator("Conditional drawings demo", "Volume-based filter", true, max_labels_count = 500)

    //@variable The number of bars in the volume average.
    int lengthInput = input.int(20, "Volume average length", 1)

    //@variable The average `volume` over `lengthInput` bars.
    float avgVolume = ta.sma(volume, lengthInput)

    //@variable A custom price filter based on volume activity.
    float filter = close
    //@variable The smoothing parameter of the filter calculation. Its value depends on multiple volume conditions.
    float alpha = na

    // Set the `alpha` to 1 if `volume` exceeds its `lengthInput`-bar moving average.
    if volume > avgVolume
        // Add debug label.
        label.new(chart.point.now(high), "alpha = 1", color = color.teal, textcolor = color.white)
        alpha := 1.0
    // Set the `alpha` to 0.5 if `volume` exceeds its previous value.
    else if volume > volume[1]
        // Add debug label.
        label.new(chart.point.now(high), "alpha = 0.5", color = color.green, textcolor = color.white)
        alpha := 0.5
    // Set the `alpha` to 0.01 otherwise.
    else
        alpha := 0.01

    // Calculate the new `filter` value.
    filter := (1.0 - alpha) * nz(filter[1], filter) + alpha * close

    // Plot the `filter`.
    plot(filter, "Filter", linewidth = 3)

Note that:
 - We added the `label.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_label.new>`__ calls *above* 
   the ``alpha`` reassignment expressions, as the returned types of each branch in the 
   `if <https://www.tradingview.com/pine-script-reference/v5/#kw_if>`__ structure must match. 
 - The `indicator() <https://www.tradingview.com/pine-script-reference/v5/#fun_indicator>`__ function includes 
   ``max_labels_count = 500`` to specify that the script can show up to 500 :ref:`labels <PageTextAndShapes_Labels>` 
   on the chart. 


.. _PageDebugging_Conditions_CompoundAndNestedConditions:

Compound and nested conditions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When a programmer needs to identify situations where more than one condition can occur, they may construct 
*compound conditions* by aggregating individual conditions with logical operators 
(`and <https://www.tradingview.com/pine-script-reference/v5/#kw_and>`__, 
`or <https://www.tradingview.com/pine-script-reference/v5/#kw_or>`__). 

For example, this line of code shows a ``compoundCondition`` variable that only returns ``true`` if ``condition1`` 
and either ``condition2`` or ``condition3`` occurs:

.. code-block:: pine

    bool compoundCondition = condition1 and (condition2 or condition3)

One may alternatively create *nested conditions* using :ref:`conditional structures <PageConditionalStructures>` or 
`ternary expressions <https://www.tradingview.com/pine-script-reference/v5/#op_?:>`__. For example, this 
`if <https://www.tradingview.com/pine-script-reference/v5/#kw_if>`__ structure assigns ``true`` to the 
``nestedCondition`` variable if ``condition1`` and ``condition2`` or ``condition3`` occurs. However, unlike 
the logical expression above, the branches of this structure also allow the script to execute additional 
code before assigning the "bool" value:

.. code-block:: pine

    bool nestedCondition = false

    if condition1
        // [additional_code]
        if condition2
            // [additional_code]
            nestedCondition := true
        else if condition3
            // [additional_code]
            nestedCondition := true

In either case, whether working with compound or nested conditions in code, one will save many headaches and ensure 
they work as expected by validating the behaviors of the *individual conditions* that compose them.

For example, this script calculates an ``rsi`` and the ``median`` of the ``rsi`` over ``lengthInput`` bars. 
Then, it creates five variables to represent different singular conditions. The script uses these variables 
in a logical expression to assign a "bool" value to the ``compoundCondition`` variable, and it displays the results 
of the ``compoundCondition`` using a :ref:`conditional background color <PageDebugging_Conditions_ConditionalColors>`:

.. image:: images/Debugging-Conditions-Compound-conditions-1.png

.. code-block:: pine

    //@version=5
    indicator("Compound conditions demo")

    //@variable The length of the RSI and median RSI calculations.
    int lengthInput = input.int(14, "Length", 2)

    //@variable The `lengthInput`-bar RSI.
    float rsi = ta.rsi(close, lengthInput)
    //@variable The `lengthInput`-bar median of the `rsi`.
    float median = ta.median(rsi, lengthInput)

    //@variable Condition #1: Is `true` when the 1-bar `rsi` change switches from 1 to -1.
    bool changeNegative = ta.change(math.sign(ta.change(rsi))) == -2
    //@variable Condition #2: Is `true` when the previous bar's `rsi` is greater than 70.
    bool prevAbove70 = rsi[1] > 70.0
    //@variable Condition #3: Is `true` when the current `close` is lower than the previous bar's `open`.
    bool closeBelow = close < open[1]
    //@variable Condition #4: Is `true` when the `rsi` is between 60 and 70.
    bool betweenLevels = bool(math.max(70.0 - rsi, 0.0) * math.max(rsi - 60.0, 0.0))
    //@variable Condition #5: Is `true` when the `rsi` is above the `median`.
    bool aboveMedian = rsi > median

    //@variable Is `true` when the first condition occurs alongside conditions 2 and 3 or 4 and 5.
    bool compundCondition = changeNegative and ((prevAbove70 and closeBelow) or (betweenLevels and aboveMedian))

    //Plot the `rsi` and the `median`.
    plot(rsi, "RSI", color.rgb(201, 109, 34), 3)
    plot(median, "RSI Median", color.rgb(180, 160, 102), 2)

    // Highlight the background red when the `compundCondition` occurs.
    bgcolor(compundCondition ? color.new(color.red, 60) : na, title = "compundCondition")

As we see above, it's not necessarily easy to understand the behavior of the ``compoundCondition`` by only visualizing 
its end result, as five underlying singular conditions determine the final value. To effectively debug the 
``compoundCondition`` in this case, we must also inspect the conditions that compose it. 

In the example below, we've added five `plotchar() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotchar>`__ 
calls to display :ref:`characters <PageDebugging_Conditions_PlottingConditionalShapes>` on the chart and numeric values 
in the status line and Data Window when each singular condition occurs. Inspecting each of these results provides us with 
more complete information about the ``compoundCondition``'s behavior:

.. image:: images/Debugging-Conditions-Compound-conditions-2.png

.. code-block:: pine

    //@version=5
    indicator("Compound conditions demo")

    //@variable The length of the RSI and median RSI calculations.
    int lengthInput = input.int(14, "Length", 2)

    //@variable The `lengthInput`-bar RSI.
    float rsi = ta.rsi(close, lengthInput)
    //@variable The `lengthInput`-bar median of the `rsi`.
    float median = ta.median(rsi, lengthInput)

    //@variable Condition #1: Is `true` when the 1-bar `rsi` change switches from 1 to -1.
    bool changeNegative = ta.change(math.sign(ta.change(rsi))) == -2
    //@variable Condition #2: Is `true` when the previous bar's `rsi` is greater than 70.
    bool prevAbove70 = rsi[1] > 70.0
    //@variable Condition #3: Is `true` when the current `close` is lower than the previous bar's `open`.
    bool closeBelow = close < open[1]
    //@variable Condition #4: Is `true` when the `rsi` is between 60 and 70.
    bool betweenLevels = bool(math.max(70.0 - rsi, 0.0) * math.max(rsi - 60.0, 0.0))
    //@variable Condition #5: Is `true` when the `rsi` is above the `median`.
    bool aboveMedian = rsi > median

    //@variable Is `true` when the first condition occurs alongside conditions 2 and 3 or 4 and 5.
    bool compundCondition = changeNegative and ((prevAbove70 and closeBelow) or (betweenLevels and aboveMedian))

    //Plot the `rsi` and the `median`.
    plot(rsi, "RSI", color.rgb(201, 109, 34), 3)
    plot(median, "RSI Median", color.rgb(180, 160, 102), 2)

    // Highlight the background red when the `compundCondition` occurs.
    bgcolor(compundCondition ? color.new(color.red, 60) : na, title = "compundCondition")

    // Plot characters on the chart when conditions 1-5 occur.
    plotchar(changeNegative ? rsi : na, "changeNegative (1)", "1", location.absolute, chart.fg_color)
    plotchar(prevAbove70 ? 70.0 : na, "prevAbove70 (2)", "2", location.absolute, chart.fg_color)
    plotchar(closeBelow ? close : na, "closeBelow (3)", "3", location.bottom, chart.fg_color)
    plotchar(betweenLevels ? 60 : na, "betweenLevels (4)", "4", location.absolute, chart.fg_color)
    plotchar(aboveMedian ? median : na, "aboveMedian (5)", "5", location.absolute, chart.fg_color)

Note that:
 - Each `plotchar() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotchar>`__ call uses a 
   :ref:`conditional number <PageDebugging_Conditions_AsNumbers>` as the ``series`` argument. The functions 
   display the numeric values in the status line and Data Window.
 - All the `plotchar() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotchar>`__ calls, excluding 
   the one for the ``closeBelow`` condition, use 
   `location.absolute <https://www.tradingview.com/pine-script-reference/v5/#const_location.absolute>`__  as 
   the ``location`` argument to display characters at precise locations whenever their ``series`` is not 
   `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ (i.e., the condition occurs). The call 
   for ``closeBelow`` uses `location.bottom <https://www.tradingview.com/pine-script-reference/v5/#const_location.bottom>`__ 
   to display its characters near the bottom of the pane.
 - In this section's examples, we assigned individual conditions to separate variables with straightforward names and 
   annotations. While this format isn't required to create a compound condition since one can combine conditions directly 
   within a logical expression, it makes for more readable code that's easier to debug, as explained in the 
   :ref:`Tips <PageDebugging_Tips>` section. 



.. _PageDebugging_Strings:

Strings
-------

:ref:`Strings <PageTypeSystem_Types_String>` are sequences of alphanumeric, control, and other characters (e.g., Unicode). 
They provide utility when debugging scripts, as programmers can use them to represent a script's data types as human-readable 
text and inspect them with :ref:`drawing types <PageTypeSystem_Types_DrawingTypes>` that have text-related properties, 
or by using :ref:`Pine Logs <PageDebugging_PineLogs>`.

.. note::
   This section discusses "string" conversions and inspecting strings via :ref:`labels <PageTextAndShapes_Labels>` and 
   :ref:`tables <PageTables>`. :ref:`Boxes <PageLinesAndBoxes_Boxes>` can also display text. However, their utility for 
   debugging strings is more limited than the techniques covered in this section and the :ref:`Pine Logs <PageDebugging_PineLogs>` 
   section below.


.. _PageDebugging_Strings_RepresentingOtherTypes:

Representing other types
^^^^^^^^^^^^^^^^^^^^^^^^

Users can create "string" representations of virtually any data type, facilitating effective debugging when other approaches 
may not suffice. Before exploring "string" inspection techniques, let's briefly review ways to *represent* a script's data using 
strings.

Pine Script™ includes predefined logic to construct "string" representations of several other built-in types, such as 
:ref:`int <PageTypeSystem_Types_Int>`, :ref:`float <PageTypeSystem_Types_Float>`, :ref:`bool <PageTypeSystem_Types_Bool>`, 
:ref:`array <PageArrays>`, and :ref:`matrix <PageMatrices>`. Scripts can conveniently represent such types as strings via the 
`str.tostring() <https://www.tradingview.com/pine-script-reference/v5/#fun_str.tostring>`__ and 
`str.format() <https://www.tradingview.com/pine-script-reference/v5/#fun_str.format>`__ functions.

For example, this snippet creates strings to represent multiple values using these functions:

.. code-block:: pine

    //@variable Returns: "1.25"
    string floatRepr = str.tostring(1.25)
    //@variable Returns: "1"
    string rounded0 = str.tostring(1.25, "#")
    //@variable Returns: "1.3"
    string rounded1 = str.tostring(1.25, "#.#")
    //@variable Returns: "1.2500"
    string trailingZeros = str.tostring(1.25, "#.0000")
    //@variable Returns: "true"
    string trueRepr = str.tostring(true)
    //@variable Returns: "false"
    string falseRepr = str.tostring(5 == 3)
    //@variable Returns: "[1, 2, -3.14]"
    string floatArrayRepr = str.tostring(array.from(1, 2.0, -3.14))
    //@variable Returns: "[2, 20, 0]"
    string roundedArrayRepr = str.tostring(array.from(2.22, 19.6, -0.43), "#")
    //@variable Returns: "[Hello, World, !]"
    string stringArrayRepr = str.tostring(array.from("Hello", "World", "!"))
    //@variable Returns: "Test: 2.718 ^ 2 > 5: true"
    string mixedTypeRepr = str.format("{0}{1, number, #.###} ^ 2 > {2}: {3}", "Test: ", math.e, 5, math.e * math.e > 5)

    //@variable Combines all the above strings into a multi-line string.
    string combined = str.format(
         "{0}\n{1}\n{2}\n{3}\n{4}\n{5}\n{6}\n{7}\n{8}\n{9}",
         floatRepr, rounded0, rounded1, trailingZeros, trueRepr,
         falseRepr, floatArrayRepr, roundedArrayRepr, stringArrayRepr,
         mixedTypeRepr
     )

When working with "int" values that symbolize UNIX timestamps, such as those returned from time-related functions and 
variables, one can also use `str.format() <https://www.tradingview.com/pine-script-reference/v5/#fun_str.format>`__ or 
`str.format_time() <https://www.tradingview.com/pine-script-reference/v5/#fun_str.format_time>`__ to convert them to 
human-readable date strings. This code block demonstrates multiple ways to convert a timestamp using these functions:

.. code-block:: pine

    //@variable A UNIX timestamp, in milliseconds.
    int unixTime = 1279411200000

    //@variable Returns: "2010-07-18T00:00:00+0000"
    string default = str.format_time(unixTime)
    //@variable Returns: "2010-07-18"
    string ymdRepr = str.format_time(unixTime, "yyyy-MM-dd")
    //@variable Returns: "07-18-2010"
    string mdyRepr = str.format_time(unixTime, "MM-dd-yyyy")
    //@variable Returns: "20:00:00, 2010-07-17"
    string hmsymdRepr = str.format_time(unixTime, "HH:mm:ss, yyyy-MM-dd", "America/New_York")
    //@variable Returns: "Year: 2010, Month: 07, Day: 18, Time: 12:00:00"
    string customFormat = str.format(
         "Year: {0, time, yyyy}, Month: {1, time, MM}, Day: {2, time, dd}, Time: {3, time, hh:mm:ss}",
         unixTime, unixTime, unixTime, unixTime
     )

When working with types that *don't* have built-in "string" representations, e.g., 
:ref:`color <PageTypeSystem_Types_Color>`, :ref:`map <PageMaps>`, :ref:`user-defined types <PageTypeSystem_UserDefinedTypes>`, 
etc., programmers can use custom logic or formatting to construct representations. For example, this code calls 
`str.format() <https://www.tradingview.com/pine-script-reference/v5/#fun_str.format>`__ to represent a "color" value using its 
`r <https://www.tradingview.com/pine-script-reference/v5/#fun_color.r>`__, 
`g <https://www.tradingview.com/pine-script-reference/v5/#fun_color.g>`__, 
`b <https://www.tradingview.com/pine-script-reference/v5/#fun_color.b>`__, and 
`t <https://www.tradingview.com/pine-script-reference/v5/#fun_color.t>`__ components:

.. code-block:: pine

    //@variable The built-in `color.maroon` value with 17% transparency.
    color myColor = color.new(color.maroon, 17)

    // Get the red, green, blue, and transparency components from `myColor`.
    float r = color.r(myColor)
    float g = color.g(myColor)
    float b = color.b(myColor)
    float t = color.t(myColor)

    //@variable Returns: "color (r = 136, g = 14, b = 79, t = 17)"
    string customRepr = str.format("color (r = {0}, g = {1}, b = {2}, t = {3})", r, g, b, t)

There are countless ways one can represent data using strings. When choosing string formats for debugging, ensure the 
results are **readable** and provide enough information for proper inspection. The following segments explain ways to 
validate strings by displaying them on the chart using :ref:`labels <PageTextAndShapes_Labels>` or 
:ref:`tables <PageTables>`, and the section after these segments explains how to display strings as messages in the 
:ref:`Pine Logs <PageDebugging_PineLogs>` pane.


.. _PageDebugging_Strings_UsingLabels:

Using labels
^^^^^^^^^^^^

:ref:`Labels <PageTextAndShapes_Labels>` allow scripts to display dynamic text ("series strings") at any available location 
on the chart. Where to display such text on the chart depends on the information the programmer wants to inspect and their 
debugging preferences. 

.. _PageDebugging_Strings_UsingLabels_OnSuccessiveBars:

On successive bars
~~~~~~~~~~~~~~~~~~

When inspecting the history of values that affect the chart's scale or working with multiple series that have different types, 
a simple, handy debugging approach is to draw :ref:`labels <PageTextAndShapes_Labels>` that display 
:ref:`string representations <PageDebugging_Strings_RepresentingOtherTypes>` on successive bars. 

For example, this script calculates four series: ``highestClose``, ``percentRank``, ``barsSinceHigh``, and ``isLow``. 
It uses `str.format() <https://www.tradingview.com/pine-script-reference/v5/#fun_str.format>`__ to create a formatted 
"string" representing the series values and a timestamp, then it calls 
`label.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_label.new>`__ to draw a 
`label <https://www.tradingview.com/pine-script-reference/v5/#type_label>`__ that display the results at the 
`high <https://www.tradingview.com/pine-script-reference/v5/#var_high>`__ on each bar:

.. image:: images/Debugging-Strings-Using-labels-On-successive-bars-1.png

.. code-block:: pine

    //@version=5
    indicator("Labels on successive bars demo", "Inspecting multiple series", true, max_labels_count = 500)

    //@variable The number of bars in the calculation window.
    int lengthInput = input.int(50, "Length", 1)

    //@variable The highest `close` over `lengthInput` bars.
    float highestClose = ta.highest(close, lengthInput)
    //@variable The percent rank of the current `close` compared to previous values over `lengthInput` bars.
    float percentRank = ta.percentrank(close, lengthInput)
    //@variable The number of bars since the `close` was equal to the `highestClose`.
    int barsSinceHigh = ta.barssince(close == highestClose)
    //@variable Is `true` when the `percentRank` is 0, i.e., when the `close` is the lowest.
    bool isLow = percentRank == 0.0

    //@variable A multi-line string representing the `time`, `highestClose`, `percentRank`, `barsSinceHigh`, and `isLow`.
    string debugString = str.format(
         "time (GMT): {0, time, yyyy-MM-dd'T'HH:mm:ss}\nhighestClose: {1, number, #.####}
         \npercentRank: {2, number, #.##}%\nbarsSinceHigh: {3, number, integer}\nisLow: {4}",
         time, highestClose, percentRank, barsSinceHigh, isLow
     )

    //@variable Draws a label showing the `debugString` at each bar's `high`.
    label debugLabel = label.new(chart.point.now(high), debugString, textcolor = color.white)

While the above example allows one to inspect the results of the script's series on any bar with a 
`label <https://www.tradingview.com/pine-script-reference/v5/#type_label>`__ drawing, consecutive drawings like these can 
clutter the chart, especially when viewing longer strings.

An alternative, more visually compact way to inspect successive bars' values with :ref:`labels <PageTextAndShapes_Labels>` 
is to utilize the ``tooltip`` property instead of the ``text`` property, as a 
`label <https://www.tradingview.com/pine-script-reference/v5/#type_label>`__ will only show its tooltip when the cursor 
*hovers* over it.

Below, we've modified the previous script by using the ``debugString`` as the ``tooltip`` argument instead of the ``text`` 
argument in the `label.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_label.new>`__ call. Now, we can view 
the results on specific bars without the extra noise:

.. image:: images/Debugging-Strings-Using-labels-On-successive-bars-2.png

.. code-block:: pine

    //@version=5
    indicator("Tooltips on successive bars demo", "Inspecting multiple series", true, max_labels_count = 500)

    //@variable The number of bars in the calculation window.
    int lengthInput = input.int(50, "Length", 1)

    //@variable The highest `close` over `lengthInput` bars.
    float highestClose = ta.highest(close, lengthInput)
    //@variable The percent rank of the current `close` compared to previous values over `lengthInput` bars.
    float percentRank = ta.percentrank(close, lengthInput)
    //@variable The number of bars since the `close` was equal to the `highestClose`.
    int barsSinceHigh = ta.barssince(close == highestClose)
    //@variable Is `true` when the `percentRank` is 0, i.e., when the `close` is the lowest.
    bool isLow = percentRank == 0.0

    //@variable A multi-line string representing the `time`, `highestClose`, `percentRank`, `barsSinceHigh`, and `isLow`.
    string debugString = str.format(
         "time (GMT): {0, time, yyyy-MM-dd'T'HH:mm:ss}\nhighestClose: {1, number, #.####}
         \npercentRank: {2, number, #.##}%\nbarsSinceHigh: {3, number, integer}\nisLow: {4}",
         time, highestClose, percentRank, barsSinceHigh, isLow
     )

    //@variable Draws a label showing the `debugString` in a tooltip at each bar's `high`.
    label debugLabel = label.new(chart.point.now(high), tooltip = debugString)

It's important to note that a script can display up to 500 
`label <https://www.tradingview.com/pine-script-reference/v5/#type_label>`__ drawings, meaning the above examples will only 
allow users to inspect the strings from the most recent 500 chart bars.

If a programmer wants to see the results from *earlier* chart bars, one approach is to create conditional logic that only 
allows drawings within a specific time range, e.g.:

.. code-block:: pine

    if time >= startTime and time <= endTime
        <create_drawing_id>

If we use this structure in our previous example with 
`chart.left_visible_bar_time <https://www.tradingview.com/pine-script-reference/v5/#var_chart.left_visible_bar_time>`__ and 
`chart.right_visible_bar_time <https://www.tradingview.com/pine-script-reference/v5/#var_chart.right_visible_bar_time>`__ as 
the ``startTime`` and ``endTime`` values, the script will only create :ref:`labels <PageTextAndShapes_Labels>` on 
**visible chart bars** and avoid drawing on others. With this logic, we can scroll to view labels on *any* chart bar, 
as long as there are up to ``max_labels_count`` bars in the visible range:

.. image:: images/Debugging-Strings-Using-labels-On-successive-bars-3.png

.. code-block:: pine

    //@version=5
    indicator("Tooltips on visible bars demo", "Inspecting multiple series", true, max_labels_count = 500)

    //@variable The number of bars in the calculation window.
    int lengthInput = input.int(50, "Length", 1)

    //@variable The highest `close` over `lengthInput` bars.
    float highestClose = ta.highest(close, lengthInput)
    //@variable The percent rank of the current `close` compared to previous values over `lengthInput` bars.
    float percentRank = ta.percentrank(close, lengthInput)
    //@variable The number of bars since the `close` was equal to the `highestClose`.
    int barsSinceHigh = ta.barssince(close == highestClose)
    //@variable Is `true` when the `percentRank` is 0, i.e., when the `close` is the lowest.
    bool isLow = percentRank == 0.0

    //@variable A multi-line string representing the `time`, `highestClose`, `percentRank`, `barsSinceHigh`, and `isLow`.
    string debugString = str.format(
         "time (GMT): {0, time, yyyy-MM-dd'T'HH:mm:ss}\nhighestClose: {1, number, #.####}
         \npercentRank: {2, number, #.##}%\nbarsSinceHigh: {3, number, integer}\nisLow: {4}",
         time, highestClose, percentRank, barsSinceHigh, isLow
     )

    if time >= chart.left_visible_bar_time and time <= chart.right_visible_bar_time
        //@variable Draws a label showing the `debugString` in a tooltip at each visible bar's `high`.
        label debugLabel = label.new(chart.point.now(high), tooltip = debugString)

Note that:
 - If the visible chart contains more bars than allowed drawings, the script will only show results on the latest bars 
   in the visible range. For best results with this technique, zoom on the chart to keep the visible range limited to 
   the allowed number of drawings. 

.. _PageDebugging_Strings_UsingLabels_AtTheEndOfTheChart:

At the end of the chart
~~~~~~~~~~~~~~~~~~~~~~~

A frequent approach to debugging a script's strings with :ref:`labels <PageTextAndShapes_Labels>` is to display them at 
the *end* of the chart, namely when the strings do not change or when only a specific bar's values require analysis. 

The script below contains a user-defined ``printLabel()`` function that draws a 
`label <https://www.tradingview.com/pine-script-reference/v5/#type_label>`__ at the last available time 
on the chart, regardless of when the script calls it. We've used the function in this example to display a "Hello world!" 
string, some basic chart information, and the data feed's current OHLCV values:

.. image:: images/Debugging-Strings-Using-labels-At-the-end-of-the-chart-1.png

.. code-block:: pine

    //@version=5
    indicator("Labels at the end of the chart demo", "Chart info", true)

    //@function     Draws a label to print the `txt` at the last available time on the chart.
    //              When called from the global scope, the label updates its text using the specified `txt` on every bar.
    //@param txt    The string to display on the chart.
    //@param price  The optional y-axis location of the label. If not specified, draws the label above the last chart bar.
    //@returns      The resulting label ID.
    printLabel(string txt, float price = na) =>
        int labelTime = math.max(last_bar_time, chart.right_visible_bar_time)
        var label result = label.new(
             labelTime, na, txt, xloc.bar_time, na(price) ? yloc.abovebar : yloc.price, na,
             label.style_none, chart.fg_color, size.large
         )
        label.set_text(result, txt)
        label.set_y(result, price)
        result

    //@variable A formatted string containing information about the current chart.
    string chartInfo = str.format(
         "Symbol: {0}:{1}\nTimeframe: {2}\nStandard chart: {3}\nReplay active: {4}",
         syminfo.prefix, syminfo.ticker, timeframe.period, chart.is_standard,
         str.contains(syminfo.tickerid, "replay")
     )

    //@variable A formatted string containing OHLCV values.
    string ohlcvInfo = str.format(
         "O: {0, number, #.#####}, H: {1, number, #.#####}, L: {2, number, #.#####}, C: {3, number, #.#####}, V: {4}",
         open, high, low, close, str.tostring(volume, format.volume)
     )

    // Print "Hello world!" and the `chartInfo` at the end of the chart on the first bar.
    if barstate.isfirst
        printLabel("Hello world!" + "\n\n\n\n\n\n\n")
        printLabel(chartInfo + "\n\n")

    // Print current `ohlcvInfo` at the end of the chart, updating the displayed text as new data comes in.
    printLabel(ohlcvInfo)

Note that:
 - The ``printLabel()`` function sets the x-coordinate of the drawn 
   `label <https://www.tradingview.com/pine-script-reference/v5/#type_label>`__ using the 
   `max <https://www.tradingview.com/pine-script-reference/v5/#fun_math.max>`__ of the 
   `last_bar_time <https://www.tradingview.com/pine-script-reference/v5/#var_last_bar_time>`__ and the 
   `chart.right_visible_bar_time <https://www.tradingview.com/pine-script-reference/v5/#var_chart.right_visible_bar_time>`__ 
   to ensure it always shows the results at the last available bar.
 - When called from the *global scope*, the function creates a 
   `label <https://www.tradingview.com/pine-script-reference/v5/#type_label>`__ with ``text`` and ``y`` properties that 
   update on every bar. 
 - We've made three calls to the function and added linefeed characters (``\n``) to demonstrate that users can superimpose 
   the results from multiple :ref:`labels <PageTextAndShapes_Labels>` at the end of the chart if the strings have adequate 
   line spacing. 


.. _PageDebugging_Strings_UsingTables:

Using tables
^^^^^^^^^^^^

:ref:`Tables <PageTables>` display strings within cells arranged in columns and rows at fixed locations relative to a chart 
pane's visual space. They can serve as versatile chart-based debugging tools, as unlike :ref:`labels <PageTextAndShapes_Labels>`, 
they allow programmers to inspect one or *more* "series strings" in an organized visual structure agnostic to the chart's 
scale or bar index. 

For example, this script calculates a custom ``filter`` whose result is the ratio of the 
`EMA <https://www.tradingview.com/pine-script-reference/v5/#fun_ta.ema>`__ of weighted 
`close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__ prices to the 
`EMA <https://www.tradingview.com/pine-script-reference/v5/#fun_ta.ema>`__ of the ``weight`` series. 
For inspection of the variables used in the calculation, it creates a `table <https://www.tradingview.com/pine-script-reference/v5/#type_table>`__ 
instance on the first bar, initializes the table's cells on the last historical bar, then updates necessary cells with "string" 
representations of the values from ``barsBack`` bars ago on the latest chart bar:

.. image:: images/Debugging-Strings-Using-tables-1.png

.. code-block:: pine

    //@version=5
    indicator("Debugging with tables demo", "History inspection", true)

    //@variable The number of bars back in the chart's history to inspect.
    int barsBack = input.int(10, "Bars back", 0, 4999)

    //@variable The percent rank of `volume` over 10 bars.
    float weight = ta.percentrank(volume, 10)
    //@variable The 10-bar EMA of `weight * close` values.
    float numerator = ta.ema(weight * close, 10)
    //@variable The 10-bar EMA of `weight` values.
    float denominator = ta.ema(weight, 10)
    //@variable The ratio of the `numerator` to the `denominator`.
    float filter = numerator / denominator

    // Plot the `filter`.
    plot(filter, "Custom filter")

    //@variable The color of the frame, border, and text in the `debugTable`.
    color tableColor = chart.fg_color

    //@variable A table that contains "string" representations of variable names and values on the latest chart bar.
    var table debugTable = table.new(
         position.top_right, 2, 5, frame_color = tableColor, frame_width = 1, border_color = tableColor, border_width = 1
     )

    // Initialize cells on the last confirmed historical bar.
    if barstate.islastconfirmedhistory
        table.cell(debugTable, 0, 0, "Variable", text_color = tableColor)
        table.cell(debugTable, 1, 0, str.format("Value {0, number, integer} bars ago", barsBack), text_color = tableColor)
        table.cell(debugTable, 0, 1, "weight", text_color = tableColor)
        table.cell(debugTable, 1, 1, "", text_color = tableColor)
        table.cell(debugTable, 0, 2, "numerator", text_color = tableColor)
        table.cell(debugTable, 1, 2, "", text_color = tableColor)
        table.cell(debugTable, 0, 3, "denominator", text_color = tableColor)
        table.cell(debugTable, 1, 3, "", text_color = tableColor)
        table.cell(debugTable, 0, 4, "filter", text_color = tableColor)
        table.cell(debugTable, 1, 4, "", text_color = tableColor)

    // Update value cells on the last available bar.
    if barstate.islast
        table.cell_set_text(debugTable, 1, 1, str.tostring(weight[barsBack], format.percent))
        table.cell_set_text(debugTable, 1, 2, str.tostring(numerator[barsBack]))
        table.cell_set_text(debugTable, 1, 3, str.tostring(denominator[barsBack]))
        table.cell_set_text(debugTable, 1, 4, str.tostring(filter[barsBack]))

Note that:
 - The script uses the `var <https://www.tradingview.com/pine-script-reference/v5/#kw_var>`__ keyword to specify 
   that the `table <https://www.tradingview.com/pine-script-reference/v5/#type_table>`__ assigned to the ``debugTable`` 
   variable on the first bar persists throughout the script's execution.
 - This script modifies the table within two `if <https://www.tradingview.com/pine-script-reference/v5/#kw_if>`__ structures. 
   The first structure initializes the cells with `table.cell() <https://www.tradingview.com/pine-script-reference/v5/#fun_table.cell>`__ 
   only on the last confirmed historical bar 
   (`barstate.islastconfirmedhistory <https://www.tradingview.com/pine-script-reference/v5/#var_barstate.islastconfirmedhistory>`__). 
   The second structure updates the ``text`` properties of relevant cells with :ref:`string representations <PageDebugging_Strings_RepresentingOtherTypes>` 
   of our variables' values using `table.cell_set_text() <https://www.tradingview.com/pine-script-reference/v5/#fun_table.cell_set_text>`__ 
   calls on the latest available bar (`barstate.islast <https://www.tradingview.com/pine-script-reference/v5/#var_barstate.islast>`__).

It's important to note that although tables can provide debugging utility, namely when working with multiple series or creating 
on-chart logs, they carry a higher computational cost than other techniques discussed on this page and may require *more code*. 
Additionally, unlike :ref:`labels <PageDebugging_Strings_UsingLabels>`, one can only view a table's state from the latest script execution. 
We therefore recommend using them *wisely* and *sparingly* while debugging, opting for *simplified* approaches where possible. For more 
information about using `table <https://www.tradingview.com/pine-script-reference/v5/#type_table>`__ objects, see the 
:ref:`Tables <PageTables>` page. 



.. _PageDebugging_PineLogs:

Pine Logs
---------

Pine Logs are *interactive messages* that scripts can output at specific points in their execution. They provide a powerful way 
for programmers to inspect a script's data, conditions, and execution flow with minimal code.

Unlike the other tools discussed on this page, Pine Logs have a deliberate design for in-depth script debugging. Scripts do not 
display Pine Logs on the chart or in the Data Window. Instead, they print messages with timestamps in the dedicated 
*Pine Logs pane*, which provides specialized navigation features and filtering options. 

To access the Pine Logs pane, select "Pine Logs..." from the Editor's "More" menu or from the "More" menu of a script loaded on 
the chart that uses ``log.*()`` functions: 

.. image:: images/Debugging-Pine-logs-1.png

.. note::
   Only **personal scripts** can generate Pine Logs. A published script *cannot* create logs, even if it has ``log.*()`` function 
   calls in its code. One must consider alternative approaches, such as those outlined in the sections above, when 
   :ref:`publishing scripts <PagePublishing>` with debugging functionality. 


.. _PageDebugging_PineLogs_CreatingLogs:

Creating logs
^^^^^^^^^^^^^

Scripts can create logs by calling the functions in the ``log.*()`` namespace. 

All ``log.*()`` functions have the following signatures:

.. code-block:: text

    log.*(message) → void

    log.*(formatString, arg0, arg1, ...) → void

The first overload logs a specified ``message`` in the Pine Logs pane. The second overload is similar to 
`str.format() <https://www.tradingview.com/pine-script-reference/v5/#fun_str.format>`__, as it logs a formatted message based on 
the ``formatString`` and the additional arguments supplied in the call. 

Each ``log.*()`` function has a different *debug level*, allowing programmers to categorize and 
:ref:`filter <PageDebugging_PineLogs_FilteringLogs>` results shown in the pane:

- The `log.info() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.info>`__ function logs an entry 
  with the *"info"* level that appears in the pane with gray text.
- The `log.warning() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.warning>`__ function logs an 
  entry with the *"warning"* level that appears in the pane with orange text.
- The `log.error() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.error>`__ function logs an entry 
  with the *"error"* level that appears in the pane with red text.

This code demonstrates the difference between all three ``log.*()`` functions. It calls 
`log.info() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.info>`__, 
`log.warning() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.warning>`__, and 
`log.error() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.error>`__ on the first available bar:

.. image:: images/Debugging-Pine-logs-Creating-logs-1.png

.. code-block:: pine

    //@version=5
    indicator("Debug levels demo", overlay = true)

    if barstate.isfirst
        log.info("This is an 'info' message.")
        log.warning("This is a 'warning' message.")
        log.error("This is an 'error' message.")

Pine Logs can execute anywhere within a script's execution. They allow programmers to track information from historical 
bars and monitor how their scripts behave on realtime, *unconfirmed* bars. When executing on historical bars, scripts 
generate a new message once for each ``log.*()`` call on a bar. On realtime bars, calls to ``log.*()`` functions can 
create new entries on *each new tick*.

For example, this script calculates the average ratio between each bar's ``close - open`` value to its ``high - low`` 
range. When the ``denominator`` is nonzero, the script calls 
`log.info() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.info>`__ to print the values of the calculation's 
variables on confirmed bars and `log.warning() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.warning>`__ 
to print the values on unconfirmed bars. Otherwise, it uses 
`log.error() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.error>`__  to indicate that division by zero 
occurred, as such cases can affect the ``average`` result:

.. image:: images/Debugging-Pine-logs-Creating-logs-2.png

.. code-block:: pine

    //@version=5
    indicator("Logging historical and realtime data demo", "Average bar ratio")

    //@variable The current bar's change from the `open` to `close`.
    float numerator = close - open
    //@variable The current bar's `low` to `high` range.
    float denominator = high - low
    //@variable The ratio of the bar's open-to-close range to its full range.
    float ratio = numerator / denominator
    //@variable The average `ratio` over 10 non-na values.
    float average = ta.sma(ratio, 10)

    // Plot the `average`.
    plot(average, "average", color.purple, 3)

    if barstate.isconfirmed
        // Log a division by zero error if the `denominator` is 0.
        if denominator == 0.0
            log.error("Division by 0 in confirmed results!")
        // Otherwise, log the confirmed values.
        else
            log.info(
                 "Values (confirmed):\nnumerator: {1, number, #.########}\ndenominator: {2, number, #.########}
                 \nratio: {0, number, #.########}\naverage: {3, number, #.########}",
                 ratio, numerator, denominator, average
             )
    else
        // Log a division by zero error if the `denominator` is 0.
        if denominator == 0.0
            log.error("Division by 0 on unconfirmed bar.")
        // Otherwise, log the unconfirmed values.
        else
            log.warning(
                 "Values (unconfirmed):\nnumerator: {1, number, #.########}\ndenominator: {2, number, #.########}
                 \nratio: {0, number, #.########}\naverage: {3, number, #.########}",
                 ratio, numerator, denominator, average
             )

Note that:
 - Pine Logs *do not roll back* on each tick in an unconfirmed bar, meaning the results for those ticks show in the pane 
   until the script restarts its execution. To only log messages on *confirmed* bars, use 
   `barstate.isconfirmed <https://www.tradingview.com/pine-script-reference/v5/#var_barstate.isconfirmed>`__ in the 
   conditions that trigger a ``log.*()`` call.
 - When logging on unconfirmed bars, we recommend ensuring those logs contain *unique information* or use different 
   *debug levels* so you can :ref:`filter <PageDebugging_PineLogs_FilteringLogs>` the results as needed. 
 - The Pine Logs pane will show up to the most recent 10,000 entries for historical bars. If a script 
   generates more than 10,000 logs on historical bars and a programmer needs to view earlier entries, 
   they can use conditional logic to limit ``log.*()`` calls to specific occurrences. See 
   :ref:`this <PageDebugging_PineLogs_FilteringLogs_UsingInputs>` section for an example that limits log generation 
   to a user-specified time range. 


.. _PageDebugging_PineLogs_InspectingLogs:

Inspecting logs
^^^^^^^^^^^^^^^

Pine Logs include some helpful features that simplify the inspection process. Whenever a script generates a log, 
it automatically prefixes the message with a granular timestamp to signify where the log event occurred in the 
time series. Additionally, each entry contains **"Source code"** and **"Scroll to bar"** icons, which appear 
when hovering over it in the Pine Logs pane:

.. image:: images/Debugging-Pine-logs-Inspecting-logs-1.png

Clicking an entry's "Source code" icon opens the script in the Pine Editor and highlights the specific line of 
code that triggered the log:

.. image:: images/Debugging-Pine-logs-Inspecting-logs-2.png

Clicking an entry's "Scroll to bar" icon navigates the chart to the specific bar where the log occurred, 
then temporarily displays a tooltip containing time information for that bar:

.. image:: images/Debugging-Pine-logs-Inspecting-logs-3.png

Note that:
 - The time information in the tooltip depends on the chart's timeframe, just like the x-axis label linked 
   to the chart's cursor and drawing tools. For example, the tooltip on an EOD chart will only show the 
   weekday and the date, whereas the tooltip on a 10-second chart will also contain the time of day, 
   including seconds. 

When a chart includes more than one script that generates logs, it's important to note that each script maintains 
its own *independent* message history. To inspect the messages from a specific script when multiple are on the chart, 
select its title from the dropdown at the top of the Pine Logs pane:

.. image:: images/Debugging-Pine-logs-Inspecting-logs-4.png


.. _PageDebugging_PineLogs_FilteringLogs:

Filtering logs
^^^^^^^^^^^^^^

A single script can generate numerous logs, depending on the conditions that trigger its ``log.*()`` calls. While 
directly scrolling through the log history to find specific entries may suffice when a script only generates 
a few, it can become unwieldy when searching through hundreds or thousands of messages.

The Pine Logs pane includes multiple options for filtering messages, which allows one to simplify their results 
by isolating specific *character sequences*, *start times*, and *debug levels*.

Clicking the "Search" icon at the top of the pane opens a search bar, which matches text to filter logged messages. 
The search filter also highlights the matched portion of each message in blue for visual reference. For example, 
here, we entered "confirmed" to match all results generated by our previous script with the word somewhere in their text:

.. image:: images/Debugging-Pine-logs-Filtering-logs-1.png

Notice that the results from this search also considered messages with *"unconfirmed"* as matches since the word 
contains our query. We can omit these matches by selecting the "Whole Word" checkbox in the options at the right 
of the search bar:

.. image:: images/Debugging-Pine-logs-Filtering-logs-2.png

This filter also supports `regular expressions (regex) <https://en.wikipedia.org/wiki/Regular_expression>`__, 
which allow users to perform advanced searches that match custom *character patterns* when selecting the "Regex" 
checkbox in the search options. For example, this regex matches all entries that contain "average" followed by a 
sequence representing a number greater than 0.5 and less than or equal to 1:

``average:\s*(0\.[6-9]\d*|0\.5\d*[1-9]\d*|1\.0*)``

.. image:: images/Debugging-Pine-logs-Filtering-logs-3.png

Clicking the "Start date" icon opens a dialog that allows users to specify the date and time of the first log 
shown in the results:

.. image:: images/Debugging-Pine-logs-Filtering-logs-4.png

After specifying the starting point, a tag containing the starting time will appear above the log history:

.. image:: images/Debugging-Pine-logs-Filtering-logs-5.png

Users can filter results by *debug level* using the checkboxes available when selecting the rightmost icon 
in the filtering options. Here, we've deactivated the "info" and "warning" levels so the results will only 
contain "error" messages:

.. image:: images/Debugging-Pine-logs-Filtering-logs-6.png

.. _PageDebugging_PineLogs_FilteringLogs_UsingInputs:

Using inputs
~~~~~~~~~~~~

Another, more involved way to interactively filter a script's logged results is to create 
:ref:`inputs <PageInputs>` linked to conditional logic that activates specific ``log.*()`` calls in the code.

Let's look at an example. This code calculates an `RMA <https://www.tradingview.com/pine-script-reference/v5/#fun_ta.rma>`__ 
of `close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__ prices and declares a few unique 
conditions to form a :ref:`compound condition <PageDebugging_Conditions_CompoundAndNestedConditions>`. The script uses 
`log.info() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.info>`__ to display important debugging 
information in the Pine Logs pane, including the values of the ``compoundCondition`` variable and the "bool" variables 
that determine its result.

We declared the ``filterLogsInput``, ``logStartInput``, and ``logEndInput`` variables respectively assigned to an 
`input.bool() <https://www.tradingview.com/pine-script-reference/v5/#fun_input.bool>`__ and two 
`input.time() <https://www.tradingview.com/pine-script-reference/v5/#fun_input.time>`__ calls for custom log filtering. 
When ``filterLogsInput`` is ``true``, the script will only generate a new log if the bar's 
`time <https://www.tradingview.com/pine-script-reference/v5/#var_time>`__ is between the ``logStartInput`` and 
``logEndInput`` values, allowing us to interactively isolate the entries that occurred within a specific time range:

.. image:: images/Debugging-Pine-logs-Filtering-logs-Using-inputs-1.png

.. code-block:: pine

    //@version=5
    indicator("Filtering logs using inputs demo", "Compound condition in input range", true)

    //@variable The length for moving average calculations.
    int lengthInput = input.int(20, "Length", 2)

    //@variable If `true`, only allows logs within the input time range.
    bool filterLogsInput = input.bool(true, "Only log in time range", group = "Log filter")
    //@variable The starting time for logs if `filterLogsInput` is `true`.
    int logStartInput = input.time(0, "Start time", group = "Log filter", confirm = true)
    //@variable The ending time for logs if `filterLogsInput` is `true`.
    int logEndInput = input.time(0, "End time", group = "Log filter", confirm = true)

    //@variable The RMA of `close` prices.
    float rma = ta.rma(close, lengthInput)

    //@variable Is `true` when `close` exceeds the `rma`.
    bool priceBelow = close <= rma
    //@variable Is `true` when the current `close` is greater than the max of the previous `hl2` and `close`.
    bool priceRising = close > math.max(hl2[1], close[1])
    //@variable Is `true` when the `rma` is positively accelerating.
    bool rmaAccelerating = rma - 2.0 * rma[1] + rma[2] > 0.0
    //@variable Is `true` when the difference between `rma` and `close` exceeds 2 times the current ATR.
    bool closeAtThreshold = rma - close > ta.atr(lengthInput) * 2.0
    //@variable Is `true` when all the above conditions occur.
    bool compoundCondition = priceBelow and priceRising and rmaAccelerating and closeAtThreshold

    // Plot the `rma`.
    plot(rma, "RMA", color.teal, 3)
    // Highlight the chart background when the `compoundCondition` occurs.
    bgcolor(compoundCondition ? color.new(color.aqua, 80) : na, title = "Compound condition highlight")

    //@variable If `filterLogsInput` is `true`, is only `true` in the input time range. Otherwise, always `true`.
    bool showLog = filterLogsInput ? time >= logStartInput and time <= logEndInput : true

    // Log results for a confirmed bar when `showLog` is `true`.
    if barstate.isconfirmed and showLog
        log.info(
             "\nclose: {0, number, #.#####}\nrma: {1, number, #.#####}\npriceBelow: {2}\npriceRising: {3}
             \nrmaAccelerating: {4}\ncloseAtThreshold: {5}\n\ncompoundCondition: {6}",
             close, rma, priceBelow, priceRising, rmaAccelerating, closeAtThreshold, compoundCondition
         )

Note that:
 - The ``input.*()`` functions assigned to the ``filterLogsInput``, ``logStartInput``, and ``logEndInput`` variables 
   include a ``group`` argument to oragnize and distinguish them in the script's settings. 
 - The `input.time() <https://www.tradingview.com/pine-script-reference/v5/#fun_input.time>`__ calls include 
   ``confirm = true`` so that we can interactively set the start and end times directly on the chart. To reset the inputs, 
   select "Reset points..." from the options in the script's "More" menu. 
 - The condition that triggers each `log.info() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.info>`__ 
   call includes `barstate.isconfirmed <https://www.tradingview.com/pine-script-reference/v5/#var_barstate.isconfirmed>`__ 
   to limit log generation to *confirmed* bars. 



.. _PageDebugging_DebuggingFunctions:

Debugging functions
-------------------

:ref:`User-defined functions <PageUserDefinedFunctions>` and :ref:`methods <PageMethods_UserDefinedMethods>` are custom 
functions written by users. They encapsulate sequences of operations that a script can invoke later in its execution. 

Every :ref:`user-defined function <PageUserDefinedFunctions>` or :ref:`method <PageMethods_UserDefinedMethods>` has a 
*local scope* that embeds into the script's global scope. The parameters in a function's signature and the variables 
declared within the function body belong to that function's local scope, and they are *not* directly accessible to a 
script's outer scope or the scopes of other functions. 

The segments below explain a few ways programmers can debug the values from a function's local scope. We will use this 
script as the starting point for our subsequent examples. It contains a ``customMA()`` function that returns an 
exponential moving average whose smoothing parameter varies based on the ``source`` distance outside the 25th and 75th 
`percentiles <https://www.tradingview.com/pine-script-reference/v5/#fun_ta.percentile_linear_interpolation>`__ over 
``length`` bars:

.. image:: images/Debugging-Debugging-functions-1.png

.. code-block:: pine

    //@version=5
    indicator("Debugging functions demo", "Custom MA", true)

    //@variable The number of bars in the `customMA()` calculation.
    int lengthInput = input.int(50, "Length", 2)

    //@function      Calculates a moving average that only responds to values outside the first and third quartiles.
    //@param source  The series of values to process.
    //@param length  The number of bars in the calculation.
    //@returns       The moving average value.
    customMA(float source, int length) =>
        //@variable The custom moving average.
        var float result = na
        // Calculate the 25th and 75th `source` percentiles.
        float q1 = ta.percentile_linear_interpolation(source, length, 25)
        float q3 = ta.percentile_linear_interpolation(source, length, 75)
        // Calculate the range values.
        float outerRange = math.max(source - q3, q1 - source, 0.0)
        float totalRange = ta.range(source, length)
        //@variable Half the ratio of the `outerRange` to the `totalRange`.
        float alpha = 0.5 * outerRange / totalRange
        // Mix the `source` with the `result` based on the `alpha` value.
        result := (1.0 - alpha) * nz(result, source) + alpha * source
        // Return the `result`.
        result
    
    //@variable The `customMA()` result over `lengthInput` bars.
    float maValue = customMA(close, lengthInput)

    // Plot the `maValue`.
    plot(maValue, "Custom MA", color.blue, 3)


.. _PageDebugging_DebuggingFunctions_ExtractingLocalVariables:

Extracting local variables
^^^^^^^^^^^^^^^^^^^^^^^^^^

When a programmer wants to inspect a :ref:`user-defined function's <PageUserDefinedFunctions>` local variables 
by :ref:`plotting <PageDebugging_NumericValues_PlottingNumbers>` its values, 
:ref:`coloring <PageDebugging_Conditions_ConditionalColors>` the background or chart bars, etc., they must *extract* 
the values to the *global scope*, as the built-in functions that produce such outputs can only accept global variables 
and literals.

Since the values returned by a function are available to the scope where a call occurs, one straightforward extraction 
approach is to have the function return a :ref:`tuple <PageTypeSystem_Tuples>` containing all the values that need inspection. 

Here, we've modified the ``customMA()`` function to return a :ref:`tuple <PageTypeSystem_Tuples>` containing all the function's 
calculated variables. Now, we can call the function with a *tuple declaration* to make the values available in the global scope 
and inspect them with :ref:`plots <PageDebugging_NumericValues_PlottingNumbers>`:

.. image:: images/Debugging-Debugging-functions-Extracting-local-variables-1.png

.. code-block:: pine

    //@version=5
    indicator("Extracting local variables with tuples demo", "Custom MA", true)

    //@variable The number of bars in the `customMA()` calculation.
    int lengthInput = input.int(50, "Length", 2)

    //@function      Calculates a moving average that only responds to values outside the first and third quartiles.
    //@param source  The series of values to process.
    //@param length  The number of bars in the calculation.
    //@returns       The moving average value.
    customMA(float source, int length) =>
        //@variable The custom moving average.
        var float result = na
        // Calculate the 25th and 75th `source` percentiles.
        float q1 = ta.percentile_linear_interpolation(source, length, 25)
        float q3 = ta.percentile_linear_interpolation(source, length, 75)
        // Calculate the range values.
        float outerRange = math.max(source - q3, q1 - source, 0.0)
        float totalRange = ta.range(source, length)
        //@variable Half the ratio of the `outerRange` to the `totalRange`.
        float alpha = 0.5 * outerRange / totalRange
        // Mix the `source` with the `result` based on the `alpha` value.
        result := (1.0 - alpha) * nz(result, source) + alpha * source
        // Return a tuple containing the `result` and other local variables.
        [result, q1, q3, outerRange, totalRange, alpha]
    
    // Declare a tuple containing all values returned by `customMA()`.
    [maValue, q1Debug, q3Debug, outerRangeDebug, totalRangeDebug, alphaDebug] = customMA(close, lengthInput)

    // Plot the `maValue`.
    plot(maValue, "Custom MA", color.blue, 3)

    //@variable Display location for plots with different scale.
    notOnPane = display.all - display.pane

    // Display the extracted `q1` and `q3` values in all plot locations.
    plot(q1Debug, "q1", color.new(color.maroon, 50))
    plot(q3Debug, "q3", color.new(color.teal, 50))
    // Display the other extracted values in the status line and Data Window to avoid impacting the scale.
    plot(outerRangeDebug, "outerRange", chart.fg_color, display = notOnPane)
    plot(totalRangeDebug, "totalRange", chart.fg_color, display = notOnPane)
    plot(alphaDebug, "alpha", chart.fg_color, display = notOnPane)
    // Highlight the chart when `alphaDebug` is 0, i.e., when the `maValue` does not change.
    bgcolor(alphaDebug == 0.0 ? color.new(color.orange, 90) : na, title = "`alpha == 0.0` highlight")

Note that:
 - We used ``display.all - display.pane`` for the plots of the ``outerRangeDebug``, ``totalRangeDebug``, and ``alphaDebug`` 
   variables to :ref:`avoid impacting the chart's scale <PageDebugging_NumericValues_PlottingNumbers_WithoutAffectingTheScale>`. 
 - The script also uses a :ref:`conditional color <PageDebugging_Conditions_ConditionalColors>` to highlight the chart pane's 
   `background <https://www.tradingview.com/pine-script-reference/v5/#fun_bgcolor>`__ when ``debugAlpha`` is 0, indicating the 
   ``maValue`` does not change.

Another, more *advanced* way to extract the values of a function's local variables is to pass them to a *reference type* 
variable declared in the global scope. 

Function scopes can access global variables for their calculations. While a script cannot directly reassign the values of 
global variables from within a function's scope, it can update the *elements or properties* of those values if they are 
reference types, such as :ref:`arrays <PageArrays>`, :ref:`matrices <PageMatrices>`, :ref:`maps <PageMaps>`, and 
:ref:`user-defined types <PageTypeSystem_UserDefinedTypes>`.

This version declares a ``debugData`` variable in the global scope that references a 
`map <https://www.tradingview.com/pine-script-reference/v5/#type_map>`__ with "string" keys and "float" values. 
Within the local scope of the ``customMA()`` function, the script puts *key-value pairs* containing each local variable's 
name and value into the map. After calling the function, the script plots the stored ``debugData`` values: 

.. code-block:: pine

    //@version=5
    indicator("Extracting local variables with reference types demo", "Custom MA", true)

    //@variable The number of bars in the `customMA()` calculation.
    int lengthInput = input.int(50, "Length", 2)

    //@variable A map with "string" keys and "float" values for debugging the `customMA()`.
    map<string, float> debugData = map.new<string, float>()
    
    //@function      Calculates a moving average that only responds to values outside the first and third quartiles.
    //@param source  The series of values to process.
    //@param length  The number of bars in the calculation.
    //@returns       The moving average value.
    customMA(float source, int length) =>
        //@variable The custom moving average.
        var float result = na
        // Calculate the 25th and 75th `source` percentiles.
        float q1 = ta.percentile_linear_interpolation(source, length, 25),    map.put(debugData, "q1", q1)
        float q3 = ta.percentile_linear_interpolation(source, length, 75),    map.put(debugData, "q3", q3)
        // Calculate the range values.
        float outerRange = math.max(source - q3, q1 - source, 0.0),           map.put(debugData, "outerRange", outerRange)
        float totalRange = ta.range(source, length),                          map.put(debugData, "totalRange", totalRange)
        //@variable Half the ratio of the `outerRange` to the `totalRange`.
        float alpha = 0.5 * outerRange / totalRange,                          map.put(debugData, "alpha", alpha)
        // Mix the `source` with the `result` based on the `alpha` value.
        result := (1.0 - alpha) * nz(result, source) + alpha * source
        // Return the `result`.
        result
    
    //@variable The `customMA()` result over `lengthInput` bars.
    float maValue = customMA(close, lengthInput)

    // Plot the `maValue`.
    plot(maValue, "Custom MA", color.blue, 3)

    //@variable Display location for plots with different scale.
    notOnPane = display.all - display.pane

    // Display the extracted `q1` and `q3` values in all plot locations.
    plot(map.get(debugData, "q1"), "q1", color.new(color.maroon, 50))
    plot(map.get(debugData, "q3"), "q3", color.new(color.teal, 50))
    // Display the other extracted values in the status line and Data Window to avoid impacting the scale.
    plot(map.get(debugData, "outerRange"), "outerRange", chart.fg_color, display = notOnPane)
    plot(map.get(debugData, "totalRange"), "totalRange", chart.fg_color, display = notOnPane)
    plot(map.get(debugData, "alpha"), "alpha", chart.fg_color, display = notOnPane)
    // Highlight the chart when the extracted `alpha` is 0, i.e., when the `maValue` does not change.
    bgcolor(map.get(debugData, "alpha") == 0.0 ? color.new(color.orange, 90) : na, title = "`alpha == 0.0` highlight")

Note that:
 - We placed each `map.put() <https://www.tradingview.com/pine-script-reference/v5/#fun_map.put>`__ call on the same line as 
   each variable declaration, separated by a comma, to keep things concise and avoid adding extra lines to the ``customMA()`` code. 
 - We used `map.get() <https://www.tradingview.com/pine-script-reference/v5/#fun_map.get>`__ to retrieve each value for the debug 
   `plot() <https://www.tradingview.com/pine-script-reference/v5/#fun_plot>`__ and 
   `bgcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_bgcolor>`__ calls. 


.. _PageDebugging_DebuggingFunctions_LocalDrawingsAndLogs:

Local drawings and logs
^^^^^^^^^^^^^^^^^^^^^^^

Unlike ``plot.*()`` functions and others that require values accessible to the global scope, scripts can generate 
:ref:`drawing objects <PageTypeSystem_Types_DrawingTypes>` and :ref:`Pine Logs <PageDebugging_PineLogs>` from directly within 
a function, allowing programmers to flexibly debug its local variables *without* extracting values to the outer scope.

In this example, we used :ref:`labels <PageTextAndShapes_Labels>` and :ref:`Pine Logs <PageDebugging_PineLogs>` to display 
:ref:`string representations <PageDebugging_Strings_RepresentingOtherTypes>` of the values within the ``customMA()`` scope. 
Inside the function, the script calls `str.format() <https://www.tradingview.com/pine-script-reference/v5/#fun_str.format>`__ 
to create a formatted string representing the local scope's data, then calls 
`label.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_label.new>`__ and 
`log.info() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.info>`__ to respectively display the text on the 
chart in a tooltip and log an "info" message containing the text in the :ref:`Pine Logs <PageDebugging_PineLogs>` pane:

.. image:: images/Debugging-Debugging-functions-Local-drawings-and-logs-1.png

.. code-block:: pine

    //@version=5
    indicator("Local drawings and logs demo", "Custom MA", true, max_labels_count = 500)

    //@variable The number of bars in the `customMA()` calculation.
    int lengthInput = input.int(50, "Length", 2)
    
    //@function      Calculates a moving average that only responds to values outside the first and third quartiles.
    //@param source  The series of values to process.
    //@param length  The number of bars in the calculation.
    //@returns       The moving average value.
    customMA(float source, int length) =>
        //@variable The custom moving average.
        var float result = na
        // Calculate the 25th and 75th `source` percentiles.
        float q1 = ta.percentile_linear_interpolation(source, length, 25)
        float q3 = ta.percentile_linear_interpolation(source, length, 75)
        // Calculate the range values.
        float outerRange = math.max(source - q3, q1 - source, 0.0)
        float totalRange = ta.range(source, length)
        //@variable Half the ratio of the `outerRange` to the `totalRange`.
        float alpha = 0.5 * outerRange / totalRange
        // Mix the `source` with the `result` based on the `alpha` value.
        result := (1.0 - alpha) * nz(result, source) + alpha * source

        //@variable A formatted string containing representations of all local variables.
        string debugText = str.format(
             "\n`customMA()` data\n----------\nsource: {0, number, #.########}\nlength: {1}\nq1: {2, number, #.########}
             \nq3: {3, number, #.########}\nouterRange: {4, number, #.########}\ntotalRange: {5, number, #.########}
             \nalpha{6, number, #.########}\nresult: {7, number, #.########}",
             source, length, q1, q3, outerRange, totalRange, alpha, result
         )
        // Draw a label with a tooltip displaying the `debugText`.
        label.new(bar_index, high, color = color.new(chart.fg_color, 80), tooltip = debugText)
        // Print an "info" message in the Pine Logs pane when the bar is confirmed.
        if barstate.isconfirmed
            log.info(debugText)
    
        // Return the `result`.
        result
    
    //@variable The `customMA()` result over `lengthInput` bars.
    float maValue = customMA(close, lengthInput)

    // Plot the `maValue`.
    plot(maValue, "Custom MA", color.blue, 3)

Note that:
 - We included ``max_labels_count = 500`` in the `indicator() <https://www.tradingview.com/pine-script-reference/v5/#fun_indicator>`__ 
   function to display :ref:`labels <PageTextAndShapes_Labels>` for the most recent 500 ``customMA()`` calls. 
 - The function uses `barstate.isconfirmed <https://www.tradingview.com/pine-script-reference/v5/#var_barstate.isconfirmed>`__ 
   in an `if <https://www.tradingview.com/pine-script-reference/v5/#kw_if>`__ statement to only call 
   `log.info() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.info>`__ on *confirmed* bars. It does not log a 
   new message on each realtime tick.



.. _PageDebugging_DebuggingLoops:

Debugging loops
---------------

:ref:`Loops <PageLoops>` are structures that repeatedly execute a code block based on a *counter* 
(`for <https://www.tradingview.com/pine-script-reference/v5/#kw_for>`__), the contents of a :ref:`collection <PageTypeSystem_Types_Collections>` 
(`for...in <https://www.tradingview.com/pine-script-reference/v5/#kw_for...in>`__), or a *condition* 
(`while <https://www.tradingview.com/pine-script-reference/v5/#kw_while>`__). They allow scripts to perform repetitive tasks without 
the need for redundant lines of code. 

Each loop instance maintains a separate local scope, which all outer scopes cannot access. All variables declared within a loop's 
scope are specific to that loop, meaning one cannot use them in an outer scope. 

As with other structures in Pine, there are numerous possible ways to debug loops. This section explores a few helpful techniques, 
including extracting local values for :ref:`plots <PagePlots>`, inspecting values with :ref:`drawings <PageTypeSystem_Types_DrawingTypes>`, 
and tracing a loop's execution with :ref:`Pine Logs <PageDebugging_PineLogs>`.

We will use this script as a starting point for the examples in the following segments. It aggregates the 
`close <https://www.tradingview.com/pine-script-reference/v5/#var_close>`__ value's rates of change over 1 - ``lookbackInput`` bars 
and accumulates them in a `for <https://www.tradingview.com/pine-script-reference/v5/#kw_for>`__ loop, then divides the result by 
the ``lookbackInput`` to calculate a final average value:

.. image:: images/Debugging-Debugging-loops-1.png

.. code-block:: pine

    //@version=5
    indicator("Debugging loops demo", "Aggregate ROC")

    //@variable The number of bars in the calculation.
    int lookbackInput = input.int(20, "Lookback", 1)

    //@variable The average ROC of `close` prices over each length from 1 to `lookbackInput` bars.
    float aroc = 0.0

    // Calculation loop.
    for length = 1 to lookbackInput
        //@variable The `close` value `length` bars ago.
        float pastClose = close[length]
        //@variable The `close` rate of change over `length` bars.
        float roc = (close - pastClose) / pastClose
        // Add the `roc` to `aroc`.
        aroc += roc

    // Divide `aroc` by the `lookbackInput`.
    aroc /= lookbackInput

    // Plot the `aroc`.
    plot(aroc, "aroc", color.blue, 3)


Note that: 
 - The ``aroc`` is a *global* variable modified within the loop, whereas ``pastClose`` and ``roc`` 
   are *local* variables inaccessible to the outer scope.


.. _PageDebugging_DebuggingLoops_InspectingASingleIteration:

Inspecting a single iteration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When a programmer needs to focus on a specific loop iteration, there are multiple techniques they can use, most of 
which entail using a *condition* inside the loop to trigger debugging actions, such as extracting values to outer variables, 
creating :ref:`drawings <PageTypeSystem_Types_DrawingTypes>`, :ref:`logging <PageDebugging_PineLogs>` messages, etc. 

This example inspects the local ``roc`` value from a single iteration of the loop in three different ways. When the loop 
counter's value equals the ``debugCounterInput``, the script assigns the ``roc`` to an ``rocDebug`` variable from the 
global scope for :ref:`plotting <PageDebugging_NumericValues_PlottingNumbers>`, draws a vertical 
`line <https://www.tradingview.com/pine-script-reference/v5/#type_line>`__ from 0 to the ``roc`` value using 
`line.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_line.new>`__, and logs a message in the 
:ref:`Pine Logs <PageDebugging_PineLogs>` pane using `log.info() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.info>`__:

.. image:: images/Debugging-Debugging-loops-Inspecting-a-single-iteration-1.png

.. code-block:: pine

    //@version=5
    indicator("Inspecting a single iteration demo", "Aggregate ROC", max_lines_count = 500)

    //@variable The number of bars in the calculation.
    int lookbackInput = input.int(20, "Lookback", 1)
    //@variable The `length` value in the loop's execution where value extraction occurs.
    int debugCounterInput = input.int(1, "Loop counter value", 1, group = "Debugging")

    //@variable The `roc` value extracted from the loop.
    float rocDebug = na

    //@variable The average ROC of `close` over lags from 1 to `lookbackInput` bars.
    float aroc = 0.0

    // Calculation loop.
    for length = 1 to lookbackInput
        //@variable The `close` value `length` bars ago.
        float pastClose = close[length]
        //@variable The `close` rate of change over `length` bars.
        float roc = (close - pastClose) / pastClose
        // Add the `roc` to `aroc`.
        aroc += roc

        // Trigger debug actions when the `length` equals the `debugCounterInput`.
        if length == debugCounterInput
            // Assign `roc` to `rocDebug` so the script can plot its value.
            rocDebug := roc
            // Draw a vertical line from 0 to the `roc` at the `bar_index`.
            line.new(bar_index, 0.0, bar_index, roc, color = color.new(color.gray, 50), width = 4)
            // Log an "info" message in the Pine Logs pane.
            log.info("{0}-bar `roc`{1}: {2, number, #.########}", length, barstate.isconfirmed ? " (confirmed)" : "", roc)

    // Divide `aroc` by the `lookbackInput`.
    aroc /= lookbackInput

    // Plot the `aroc`.
    plot(aroc, "aroc", color.blue, 3)

    // Plot the `rocDebug`.
    plot(rocDebug, "Extracted roc", color.new(color.rgb(206, 55, 136), 40), 2)

Note that:
 - The `input.int() <https://www.tradingview.com/pine-script-reference/v5/#fun_input.int>`__ call assigned to the 
   ``debugCounterInput`` includes a ``group`` argument to distinguish it in the script's settings. 
 - The `log.info() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.info>`__ call includes "(confirmed)" 
   in the formatted message whenever `barstate.isconfirmed <https://www.tradingview.com/pine-script-reference/v5/#var_barstate.isconfirmed>`__ 
   is ``true``. Searching this text in the :ref:`Pine Logs <PageDebugging_PineLogs>` pane will filter out the entries 
   from unconfirmed bars. See the :ref:`Filtering logs <PageDebugging_PineLogs_FilteringLogs>` section above. 


.. _PageDebugging_DebuggingLoops_InspectingMultipleIterations:

Inspecting multiple iterations
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When inspecting the values from several loop iterations, it's often helpful to utilize 
:ref:`collections <PageTypeSystem_Types_Collections>` or strings to gather the results for use in output functions after 
the loop terminates. 

This version demonstrates a few ways to collect and display the loop's values from all iterations. It declares a ``logText`` 
string and a ``debugValues`` array in the global scope. Inside the local scope of the 
`for <https://www.tradingview.com/pine-script-reference/v5/#kw_for>`__ loop, the script *concatenates* a 
:ref:`string representation <PageDebugging_Strings_RepresentingOtherTypes>` of the ``length`` and ``roc`` with the 
``logText`` and calls `array.push() <https://www.tradingview.com/pine-script-reference/v5/#fun_array.push>`__ to push the 
iteration's ``roc`` value into the ``debugValues`` array. 

After the loop ends, the script :ref:`plots <PageDebugging_NumericValues_PlottingNumbers>` the 
`first <https://www.tradingview.com/pine-script-reference/v5/#fun_array.first>`__ and 
`last <https://www.tradingview.com/pine-script-reference/v5/#fun_array.last>`__ value from the ``debugValues`` array, 
draws a `label <https://www.tradingview.com/pine-script-reference/v5/#type_label>`__ with a *tooltip* showing a 
:ref:`string representation <PageDebugging_Strings_RepresentingOtherTypes>` of the 
`array <https://www.tradingview.com/pine-script-reference/v5/#type_array>`__, and displays the ``logText`` in the 
:ref:`Pine Logs <PageDebugging_PineLogs>` pane upon the bar's confirmation:

.. image:: images/Debugging-Debugging-loops-Inspecting-multiple-iterations-1.png

.. code-block:: pine

    //@version=5
    indicator("Inspecting multiple iterations demo", "Aggregate ROC", max_labels_count = 500)

    //@variable The number of bars in the calculation.
    int lookbackInput = input.int(20, "Lookback", 1)

    //@variable An array containing the `roc` value from each loop iteration.
    array<float> debugValues = array.new<float>()
    //@variable A "string" containing information about the `roc` on each iteration.
    string logText = ""

    //@variable The average ROC of `close` over lags from 1 to `lookbackInput` bars.
    float aroc = 0.0

    // Calculation loop.
    for length = 1 to lookbackInput
        //@variable The `close` value `length` bars ago.
        float pastClose = close[length]
        //@variable The `close` rate of change over `length` bars.
        float roc = (close - pastClose) / pastClose
        // Add the `roc` to `aroc`.
        aroc += roc
    
        // Concatenate a new "string" representation with the `debugText`.
        logText += "\nlength: " + str.tostring(length) + ", roc: " + str.tostring(roc)
        // Push the `roc` value into the `debugValues` array.
        array.push(debugValues, roc)

    // Divide `aroc` by the `lookbackInput`.
    aroc /= lookbackInput

    // Plot the `aroc`.
    plot(aroc, "aroc", color.blue, 3)

    // Plot the `roc` values from the first and last iteration.
    plot(array.first(debugValues), "First iteration roc", color.new(color.rgb(166, 84, 233), 50), 2)
    plot(array.last(debugValues), "Last iteration roc", color.new(color.rgb(115, 86, 218), 50), 2)
    // Draw a label with a tooltip containing a "string" representation of the `debugValues` array.
    label.new(bar_index, aroc, color = color.new(color.rgb(206, 55, 136), 70), tooltip = str.tostring(debugValues))
    // Log the `logText` in the Pine Logs pane when the bar is confirmed.
    if barstate.isconfirmed
        log.info(logText)

Another way to inspect a loop over several iterations is to generate sequential :ref:`Pine Logs <PageDebugging_PineLogs>` 
or create/modify :ref:`drawing objects <PageTypeSystem_Types_DrawingTypes>` within the loop's scope to trace its 
execution pattern with granular detail. 

This example uses :ref:`Pine Logs <PageDebugging_PineLogs>` to trace the execution flow of our script's loop. 
It generates a new "info" message on each iteration to track the local scope's calculations as the loop 
progresses on each confirmed bar:

.. image:: images/Debugging-Debugging-loops-Inspecting-multiple-iterations-2.png

.. code-block:: pine

    //@version=5
    indicator("Inspecting multiple iterations demo", "Aggregate ROC")

    //@variable The number of bars in the calculation.
    int lookbackInput = input.int(20, "Lookback", 1)

    //@variable The average ROC of `close` over lags from 1 to `lookbackInput` bars.
    float aroc = 0.0

    // Calculation loop.
    for length = 1 to lookbackInput
        //@variable The `close` value `length` bars ago.
        float pastClose = close[length]
        //@variable The `close` rate of change over `length` bars.
        float roc = (close - pastClose) / pastClose
        // Add the `roc` to `aroc`.
        aroc += roc
        if barstate.isconfirmed
            log.info(
                 "{0}\nlength (counter): {1}\npastClose: {2, number, #.#####}\n
                 distance to pastClose: {3, number, #.########}\nroc: {4, number, #.########}\n
                 aroc (before division): {5, number, #.########}\n{6}",
                 length == 1 ? "LOOP START" : "",
                 length, pastClose, close - pastClose, roc, aroc,
                 length == lookbackInput ? "LOOP END" : ""
             )

    // Divide `aroc` by the `lookbackInput`.
    aroc /= lookbackInput

    // Plot the `aroc`.
    plot(aroc, "aroc", color.blue, 3)

Note that:
 - When iteratively generating :ref:`logs <PageDebugging_PineLogs>` or drawings from inside a loop, make it a point 
   to avoid unnecessary clutter and strive for easy navigation. More is not always better for debugging, especially 
   when working within loops.  



.. _PageDebugging_Tips:

Tips
----


.. _PageDebugging_Tips_OrganizationAndReadability:

Organization and readability
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When writing scripts, it's wise to prioritize organized, readable source codes. Code that's organized and 
easy to read helps streamline the debugging process. Additionally, well-written code is easier to maintain over time. 

Here are a few quick tips based on our :ref:`Style guide <PageStyleGuide>` and the examples on this page:

- Aim to follow the general :ref:`script organization <PageStyleGuide_ScriptOrganization>` recommendations. 
  Organizing scripts using this structure makes things easier to locate and inspect. 
- Choose variable and function names that make them easy to *identify* and *understand*. See the 
  :ref:`Naming conventions <PageStyleGuide_NamingConventions>` section for some examples. 
- It's often helpful to temporarily assign important parts of expressions to variables with informative names while debugging. 
  Breaking expressions down into reusable parts helps simplify inspection processes.
- Use *comments* and *annotations* (``//@function``, ``//@variable``, etc.) to document your code. Annotations are particularly 
  helpful, as the Pine Editor's autosuggest displays variable and function descriptions in a pop-up when hovering over their 
  identifiers anywhere in the code.
- Remember that *less is more* in many cases. Don't overwhelm yourself with excessive script outputs or unnecessary information 
  while debugging. Keep things simple, and only include as much information as you need.


.. _PageDebugging_Tips_SpeedingUpRepetitiveTasks:

Speeding up repetitive tasks
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

There are a few handy techniques we often utilize when debugging our code:

- We use `plotchar() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotchar>`__ or 
  `plotshape() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotshape>`__ to quickly display the results 
  of "int", "float", or "bool" variables and expressions in the script's status line and the Data Window.
- We often use `bgcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_bgcolor>`__ to visualize the history 
  of certain :ref:`conditions <PageDebugging_Conditions>` on the chart. 
- We use a one-line version of our ``printLabel()`` function from 
  :ref:`this section <PageDebugging_Strings_UsingLabels_AtTheEndOfTheChart>` to print strings at the end of the chart.
- We use a `label.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_label.new>`__ call with a ``tooltip`` 
  argument to display strings in tooltips :ref:`on successive bars <PageDebugging_Strings_UsingLabels_OnSuccessiveBars>`.
- We use the ``log.*()`` functions to quickly display data with 
  :ref:`string representations <PageDebugging_Strings_RepresentingOtherTypes>` in the 
  :ref:`Pine Logs <PageDebugging_PineLogs>` pane.

When one establishes their typical debugging processes, it's often helpful to create *keyboard macros* to speed up 
repetitive tasks and spend less time setting up debug outputs in each code.

The following is a simple *AutoHotkey* script (**not** Pine Script™ code) that includes hotstrings for the above five techniques. 
The script generates code snippets by entering a specified character sequence followed by a whitespace:

.. code-block:: ahk

    ; ————— This is AHK code, not Pine Script™. —————

    ; Specify that hotstrings trigger when they end with space, tab, linefeed, or carriage return.
    #Hotstring EndChars `t `n `r

    :X:,,show::SendInput, plotchar(%Clipboard%, "%Clipboard%", "", color = chart.fg_color, display = display.all - display.pane){Enter}
    :X:,,highlight::SendInput, bgcolor(bool(%Clipboard%) ? color.new(color.orange, 80) : na, title = "%Clipboard% highlight"){Enter}
    :X:,,print::SendInput, printLabel(string txt, float price = na) => int labelTime = math.max(last_bar_time, chart.right_visible_bar_time), var label result = label.new(labelTime, na, txt, xloc.bar_time, na(price) ? yloc.abovebar : yloc.price, na, label.style_none, chart.fg_color, size.large), label.set_text(result, txt), label.set_y(result, price), result`nprintLabel(){Left}
    :X:,,tooltip::SendInput, label.new(bar_index, high, color = color.new(chart.fg_color, 70), tooltip = str.tostring(%Clipboard%)){Enter}
    :X:,,log::SendInput, log.info(str.tostring(%Clipboard%)){Enter}

The ",,show" macro generates a `plotchar() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotchar>`__ call that uses 
the clipboard's contents for the ``series`` and ``title`` arguments. Copying a ``variableName`` variable or the ``close > open`` 
expression and typing ",,show" followed by a space will respectively yield:

.. code-block:: pine

    plotchar(variableName, "variableName", "", color = chart.fg_color, display = display.all - display.pane)
    plotchar(close > open, "close > open", "", color = chart.fg_color, display = display.all - display.pane)

The ",,highlight" macro generates a `bgcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_bgcolor>`__ call 
that highlights the chart pane's background with a :ref:`conditional color <PageDebugging_Conditions_ConditionalColors>` based 
on the variable or expression copied to the clipboard. For example, copying the 
`barstate.isrealtime <https://www.tradingview.com/pine-script-reference/v5/#var_barstate.isrealtime>`__ variable and typing 
",,highlight" followed by a space will yield:

.. code-block:: pine

    bgcolor(bool(barstate.isrealtime) ? color.new(color.orange, 80) : na, title = "barstate.isrealtime highlight")

The ",,print" macro generates the one-line ``printLabel()`` function and creates an empty ``printLabel()`` call with the cursor 
placed inside it. All you need to do after typing ",,print" followed by a space is enter the text you want to display:

.. code-block:: pine

    printLabel(string txt, float price = na) => int labelTime = math.max(last_bar_time, chart.right_visible_bar_time), var label result = label.new(labelTime, na, txt, xloc.bar_time, na(price) ? yloc.abovebar : yloc.price, na, label.style_none, chart.fg_color, size.large), label.set_text(result, txt), label.set_y(result, price), result
    printLabel()

The ",,tooltip" macro generates a `label.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_label.new>`__ call with 
a ``tooltip`` argument that uses `str.tostring() <https://www.tradingview.com/pine-script-reference/v5/#fun_str.tostring>`__ on 
the clipboard's contents. Copying the ``variableName`` variable and typing ",,tooltip" followed by a space yields:

.. code-block:: pine

    label.new(bar_index, high, color = color.new(chart.fg_color, 70), tooltip = str.tostring(variableName))

The ",,log" macro generates a `log.info() <https://www.tradingview.com/pine-script-reference/v5/#fun_log.info>`__ call with a ``message`` 
argument that uses `str.tostring() <https://www.tradingview.com/pine-script-reference/v5/#fun_str.tostring>`__ on the clipboard's 
contents to display string representations of variables and expressions in the :ref:`Pine Logs <PageDebugging_PineLogs>` pane. 
Copying the expression ``bar_index % 2 == 0`` and typing ",,log" followed by a space yields:

.. code-block:: pine

    log.info(str.tostring(bar_index % 2 == 0))

Note that:
 - AHK is available for *Windows* devices. Research other software to employ a similar process if your machine 
   uses a different operating system.



.. image:: /images/logo/TradingView_Logo_Block.svg
    :width: 200px
    :align: center
    :target: https://www.tradingview.com/
