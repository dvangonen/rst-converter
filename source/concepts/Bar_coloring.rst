.. image:: /images/logo/Pine_Script_logo.svg
   :alt: Pine Script™ logo
   :target: https://www.tradingview.com/pine-script-docs/en/v5/Introduction.html
   :align: right
   :width: 100
   :height: 100

   
.. _PageBarColoring:


Bar coloring
============

.. contents:: :local:
    :depth: 3
    

The `barcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_barcolor>`__ function lets you color chart bars.
It is the only Pine Script™ function that allows a script running in a pane to affect the chart.

The function's signature is:

.. code-block:: text

    barcolor(color, offset, editable, show_last, title) → void

The coloring can be conditional because the ``color`` parameter accepts "series color" arguments.

The following script renders *inside* and *outside* bars in different colors:

.. image:: images/BarColoring-1.png


.. code-block:: pine

    //@version=5
    indicator("barcolor example", overlay = true)
    isUp = close > open
    isDown = close <= open
    isOutsideUp = high > high[1] and low < low[1] and isUp
    isOutsideDown = high > high[1] and low < low[1] and isDown
    isInside = high < high[1] and low > low[1]
    barcolor(isInside ? color.yellow : isOutsideUp ? color.aqua : isOutsideDown ? color.purple : na)

Note that:

- The `na <https://www.tradingview.com/pine-script-reference/v5/#var_na>`__ value leaves bars as is.
- In the `barcolor() <https://www.tradingview.com/pine-script-reference/v5/#fun_barcolor>`__ call,
  we use embedded `?: <https://www.tradingview.com/pine-script-reference/v5/#op_{question}{colon}>`__
  ternary operator expressions to select the color.


.. image:: /images/logo/TradingView_Logo_Block.svg
    :width: 200px
    :align: center
    :target: https://www.tradingview.com/