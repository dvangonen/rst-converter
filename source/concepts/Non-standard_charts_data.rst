.. image:: /images/logo/Pine_Script_logo.svg
   :alt: Pine Script™ logo
   :target: https://www.tradingview.com/pine-script-docs/en/v5/Introduction.html
   :align: right
   :width: 100
   :height: 100


.. _PageNonStandardChartsData:


Non-standard charts data
========================

.. contents:: :local:
    :depth: 3



Introduction
------------

These functions allow scripts to fetch information from non-standard
bars or chart types, regardless of the type of chart the script is running on.
They are:
`ticker.heikinashi() <https://www.tradingview.com/pine-script-reference/v5/#fun_ticker{dot}heikinashi>`_,
`ticker.renko() <https://www.tradingview.com/pine-script-reference/v5/#fun_ticker{dot}renko>`_,
`ticker.linebreak() <https://www.tradingview.com/pine-script-reference/v5/#fun_ticker{dot}linebreak>`_,
`ticker.kagi() <https://www.tradingview.com/pine-script-reference/v5/#fun_ticker{dot}kagi>`_ and 
`ticker.pointfigure() <https://www.tradingview.com/pine-script-reference/v5/#fun_ticker{dot}pointfigure>`_.
All of them work in the same manner; they create a special ticker identifier to be used as
the first argument in a `request.security() <https://www.tradingview.com/pine-script-reference/v5/#fun_request{dot}security>`__ function call.



\`ticker.heikinashi()\`
-----------------------

*Heikin-Ashi* means *average bar* in Japanese. 
The open/high/low/close values of Heikin-Ashi candlesticks are synthetic; they are not actual market prices.
They are calculated by averaging combinations of real OHLC values from the current and previous bar. 
The calculations used make Heikin-Ashi bars less noisy than normal candlesticks.
They can be useful to make visual assessments, but are unsuited to backtesting or automated trading, 
as orders execute on market prices — not Heikin-Ashi prices.

The `ticker.heikinashi() <https://www.tradingview.com/pine-script-reference/v5/#fun_ticker{dot}heikinashi>`__
function creates a special ticker identifier for
requesting Heikin-Ashi data with the `request.security() <https://www.tradingview.com/pine-script-reference/v5/#fun_request{dot}security>`__ function.

This script requests the close value of Heikin-Ashi bars and plots them on top of the normal candlesticks:

.. image:: images/NonStandardCharts-TickerHeikinAshi-01.png

.. code-block:: pine

    //@version=5
    indicator("HA Close", "", true)
    haTicker = ticker.heikinashi(syminfo.tickerid)
    haClose = request.security(haTicker, timeframe.period, close)
    plot(haClose, "HA Close", color.black, 3)

Note that:

- The close values for Heikin-Ashi bars plotted as the black line are very different from those of real candles using market prices. They act more like a moving average.
- The black line appears over the chart bars because we have selected "Visual Order/Bring to Front" from the script's "More" menu.

If you wanted to omit values for extended hours in the last example, 
an intermediary ticker without extended session information would need to be created first:

.. image:: images/NonStandardCharts-TickerHeikinAshi-02.png

.. code-block:: pine

    //@version=5
    indicator("HA Close", "", true)
    regularSessionTicker = ticker.new(syminfo.prefix, syminfo.ticker, session.regular)
    haTicker = ticker.heikinashi(regularSessionTicker)
    haClose = request.security(haTicker, timeframe.period, close, gaps = barmerge.gaps_on)
    plot(haClose, "HA Close", color.black, 3, plot.style_linebr)

Note that:

- We use the `ticker.new() <https://www.tradingview.com/pine-script-reference/v5/#fun_ticker{dot}new>`__ function first, 
  to create a ticker without extended session information.
- We use that ticker instead of `syminfo.tickerid <https://www.tradingview.com/pine-script-reference/v5/#var_syminfo{dot}tickerid>`__ in our 
  `ticker.heikinashi() <https://www.tradingview.com/pine-script-reference/v5/#fun_ticker{dot}heikinashi>`__ call.
- In our `request.security() <https://www.tradingview.com/pine-script-reference/v5/#fun_request{dot}security>`__ call,
  we set the ``gaps`` parameter's value to ``barmerge.gaps_on``.
  This instructs the function not to use previous values to fill slots where data is absent.
  This makes it possible for it to return `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__
  values outside of regular sessions.
- To be able to see this on the chart, we also need to use a special ``plot.style_linebr`` style,
  which breaks the plots on `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ values.

This script plots Heikin-Ashi candles under the chart:

.. image:: images/NonStandardCharts-TickerHeikinAshi-03.png

.. code-block:: pine

    //@version=5
    indicator("Heikin-Ashi candles")
    CANDLE_GREEN = #26A69A
    CANDLE_RED   = #EF5350
    
    haTicker = ticker.heikinashi(syminfo.tickerid)
    [haO, haH, haL, haC] = request.security(haTicker, timeframe.period, [open, high, low, close])
    candleColor = haC >= haO ? CANDLE_GREEN : CANDLE_RED
    plotcandle(haO, haH, haL, haC, color = candleColor)

Note that:

- We use a :ref:`tuple <PageVariableDeclarations_TupleDeclarations>` with 
  `request.security() <https://www.tradingview.com/pine-script-reference/v5/#fun_request{dot}security>`__
  to fetch four values with the same call.
- We use `plotcandle() <https://www.tradingview.com/pine-script-reference/v5/#fun_plotcandle>`__
  to plot our candles. See the :ref:`Bar plotting <PageBarPlotting>` page for more information.



\`ticker.renko()\`
------------------

*Renko* bars only plot price movements, without taking time or
volume into consideration. They look like bricks stacked in adjacent columns [#ticks]_.
A new brick is only drawn after the price passes the top or bottom by a predetermined amount.
The `ticker.renko() <https://www.tradingview.com/pine-script-reference/v5/#fun_ticker{dot}renko>`__
function creates a ticker id which can be used with 
`request.security() <https://www.tradingview.com/pine-script-reference/v5/#fun_request{dot}security>`__
to fetch Renko values, but there is no Pine Script™ function to draw Renko bars on the chart:

.. code-block:: pine

    //@version=5
    indicator("", "", true)
    renkoTicker = ticker.renko(syminfo.tickerid, "ATR", 10)
    renkoLow = request.security(renkoTicker, timeframe.period, low)
    plot(renkoLow)



\`ticker.linebreak()\`
----------------------

The *Line Break* chart type displays a series of vertical boxes that are based on
price changes [#ticks]_.
The `ticker.linebreak() <https://www.tradingview.com/pine-script-reference/v5/#fun_ticker{dot}linebreak>`__
function creates a ticker id which can be used with 
`request.security() <https://www.tradingview.com/pine-script-reference/v5/#fun_request{dot}security>`__
to fetch "Line Break" values, but there is no Pine Script™ function to draw such bars on the chart:

.. code-block:: pine

    //@version=5
    indicator("", "", true)
    lineBreakTicker = ticker.linebreak(syminfo.tickerid, 3)
    lineBreakClose = request.security(lineBreakTicker, timeframe.period, close)
    plot(lineBreakClose)



\`ticker.kagi()\`
-----------------

*Kagi* charts are made of a continuous line that changes directions.
The direction changes when the price changes [#ticks]_
beyond a predetermined amount.
The `ticker.kagi() <https://www.tradingview.com/pine-script-reference/v5/#fun_ticker{dot}kagi>`__
function creates a ticker id which can be used with 
`request.security() <https://www.tradingview.com/pine-script-reference/v5/#fun_request{dot}security>`__
to fetch "Kagi" values, but there is no Pine Script™ function to draw such bars on the chart:

.. code-block:: pine

    //@version=5
    indicator("", "", true)
    kagiBreakTicker = ticker.linebreak(syminfo.tickerid, 3)
    kagiBreakClose = request.security(kagiBreakTicker, timeframe.period, close)
    plot(kagiBreakClose)



\`ticker.pointfigure()\`
------------------------

*Point and Figure* (PnF) charts only plot price movements [#ticks]_, without
taking time into consideration. A column of X's is plotted as the price
rises, and O's are plotted when price drops.
The `ticker.pointfigure() <https://www.tradingview.com/pine-script-reference/v5/#fun_ticker{dot}pointfigure>`__
function creates a ticker id which can be used with 
`request.security() <https://www.tradingview.com/pine-script-reference/v5/#fun_request{dot}security>`__
to fetch "PnF" values, but there is no Pine Script™ function to draw such bars on the chart.
Every column of X's or O's is represented with four numbers. You may
think of them as synthetic OHLC PnF values:

.. code-block:: pine

    //@version=5
    indicator("", "", true)
    pnfTicker = ticker.pointfigure(syminfo.tickerid, "hl", "ATR", 14, 3)
    [pnfO, pnfC] = request.security(pnfTicker, timeframe.period, [open, close], barmerge.gaps_on)
    plot(pnfO, "PnF Open", color.green, 4, plot.style_linebr)
    plot(pnfC, "PnF Close", color.red, 4, plot.style_linebr)



.. rubric:: Footnotes

.. [#ticks] On TradingView, Renko, Line Break, Kagi and PnF chart types are generated from OHLC values from a lower timeframe.
   These chart types thus represent only an approximation of what they would be like if they were generated from tick data.


.. image:: /images/logo/TradingView_Logo_Block.svg
    :width: 200px
    :align: center
    :target: https://www.tradingview.com/