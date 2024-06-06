study annotation
----------------

Every *study* (also known as an *indicator*) [#strategy]_ script must contain one call of the
`study <https://www.tradingview.com/pine-script-reference/v4/#fun_study>`__
annotation function, which has the following signature:

.. code-block:: text

    study(title, shorttitle, overlay, format, precision)

The ``study`` annotation determines the indicator's general properties.
Only the ``title`` parameter is mandatory. It defines the name of the
indicator. This name will be used in the *Indicators* dialog box and is
independent of the name used to save the script in your Personal Library.

``shorttitle`` is the short name of the indicator displayed on the
chart, if it must be different than the value of ``title``.

``overlay`` is a logical argument. If it is true then the study
will be added as an overlay on top of the main chart. If it is false
then it will be added in a separate pane. False is the default
setting. Note that if you change the parameter's value in a script that is
already on a chart, you need to use the *Add to Chart* button to apply the change.

``format`` defines the type of formatting used for study values appearing 
on the price axis, in indicator values or in the Data Window.
Possible values are: ``format.inherit``, ``format.price`` and ``format.volume``. 
The default is ``format.inherit``, which uses the format settings from the chart, 
unless ``precision=`` is also used, in which case it will override 
the effect of ``format.inherit``. When ``format.price`` is used, 
the default precision will be "2", unless one is specified using ``precision=``. When
``format.volume`` is used, the format is equivalent to ``precision=0`` used in 
earlier versions of Pine, where "5183" becomes "5.183K".

``precision`` is the number of digits after the floating point 
used to format study values.
It must be a non-negative integer and not greater than 16.
If omitted, then formatting from the parent series on the chart will be used.
If the format is ``format.inherit`` and the ``precision`` parameter is used with a value, 
then the study will not inherit formatting from the chart's settings and 
the value specified will be used instead, as if ``format=format.price`` 
had been used.


.. rubric:: Footnote

.. [#strategy] Pine also has a `strategy <https://www.tradingview.com/pine-script-reference/v4/#fun_strategy>`__
   annotation function which is used to create a :doc:`backtesting strategy </essential/Strategies>` rather than a study (or indicator).
