.. image:: /images/logo/Pine_Script_logo.svg
   :alt: Pine Script™ logo
   :target: https://www.tradingview.com/pine-script-docs/en/v5/Introduction.html
   :align: right
   :width: 100
   :height: 100


.. _PageDeclarationStatements:


Declaration statements
======================

.. contents:: :local:
    :depth: 3



Introduction
------------



\`indicator()\`
---------------

Every *indicator* [#strategy]_ script must contain one call to the
`indicator <https://www.tradingview.com/pine-script-reference/v5/#fun_indicator>`__
function, which has the following signature:

.. code-block:: text

    indicator(title, shorttitle, overlay, format, precision, scale, max_bars_back, timeframe, timeframe_gaps, explicit_plot_zorder, max_lines_count, max_labels_count, max_boxes_count)

The ``indicator`` function determines the indicator's general properties. The most important arguments of the indicator function are described below, a full overview of all `indicator()`` parameters can be found in its Reference Manual entry.

Only the ``title`` parameter is mandatory. It defines the name of the
indicator. This name will be used in the *Indicators* dialog box and is
independent of the name used to save the script in your Personal Library.

``shorttitle`` is the short name of the indicator displayed on the
chart, if it must be different than the value of ``title``.

``overlay`` is a "bool" parameter. If it is true then the study
will be added as an overlay on top of the main chart. If it is false
then it will be added in a separate pane. False is the default
setting. Note that if you change the parameter's value in a script that is
already on a chart, you need to use the *Add to Chart* button to apply the change.

``format`` defines the type of formatting used for study values appearing 
on the price axis, in indicator values or in the Data Window.
Possible values are: ``format.inherit``, ``format.price`` and ``format.volume``. 
The default is ``format.inherit``, which uses the format settings from the chart, 
unless ``precision =`` is also used, in which case it will override 
the effect of ``format.inherit``. When ``format.price`` is used, 
the default precision will be "2", unless one is specified using ``precision =``. When
``format.volume`` is used, the format is equivalent to ``precision = 0`` used in 
earlier versions of Pine Script™, where "5183" becomes "5.183K".

``precision`` is the number of digits after the floating point 
used to format study values.
It must be a non-negative integer and not greater than 16.
If omitted, then formatting from the parent series on the chart will be used.
If the format is ``format.inherit`` and the ``precision`` parameter is used with a value, 
then the study will not inherit formatting from the chart's settings and 
the value specified will be used instead, as if ``format = format.price`` 
had been used.



\`strategy()\`
--------------



\`library()\`
-------------



.. rubric:: Footnote

.. [#strategy] Pine Script™ also has a `strategy() <https://www.tradingview.com/pine-script-reference/v5/#fun_strategy>`__
   annotation function which is used to create a :ref:`strategy <PageStrategies>` rather than an indicator.


.. image:: /images/logo/TradingView_Logo_Block.svg
    :width: 200px
    :align: center
    :target: https://www.tradingview.com/