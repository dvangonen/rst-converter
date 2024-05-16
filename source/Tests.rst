.. _PageTests:

.. |TVLogoHeader| image:: /images/logo/Pine_Script_logo_small.png
   :alt: Pine Script™
   :align: right
   :width: 50
   :height: 50

.. |tvlogofooter| image:: /images/logo/TradingView_Logo_Block.svg
   :width: 400px
   :align: center


.. |pic1| image:: /images/logo/Pine_Script_logo.svg
   :alt: Pine Script™ logo
   :target: https://www.tradingview.com/pine-script-docs/en/v5/Introduction.html
   :width: 100
   :height: 100
   :class: right

.. |pic2| image:: /images/logo/Pine_Script_logo.svg
   :alt: Pine Script™ logo
   :target: https://www.tradingview.com/pine-script-docs/en/v5/Introduction.html
   :width: 100
   :height: 100
   :class: right

.. class:: right

.. align:: right

.. class:: right

   This paragraph will be to the right.

|pic1| test |pic2|

.. image:: /images/logo/Pine_Script_logo.svg
   :alt: Pine Script™ logo
   :target: https://www.tradingview.com/pine-script-docs/en/v5/Introduction.html
   :align: right
   :width: 100
   :height: 100
   :class: right
.. image:: /images/logo/Pine_Script_logo.svg
   :alt: Pine Script™ logo
   :target: https://www.tradingview.com/pine-script-docs/en/v5/Introduction.html
   :align: right
   :width: 100
   :height: 100
   :class: right

Note that:

- The `time <https://www.tradingview.com/pine-script-reference/v5/#var_time>`__ and
  `time_close <https://www.tradingview.com/pine-script-reference/v5/#var_time_close>`__ variables
  returns a timestamp in `UNIX time <https://en.wikipedia.org/wiki/Unix_time>`__, which is independent of the timezone selected by the user on his chart.
  In this case, the **chart's** time zone setting is the exchange time zone, so whatever symbol is on the chart, 
  its exchange time zone will be used for the display of the date and time values on the chart's cursor.
  The NASDAQ's time zone is UTC-4, but this only affects the chart's display of date/time values; it has no impact on the
  values plotted by the script.
- The last `time <https://www.tradingview.com/pine-script-reference/v5/#var_time>`__
  value for the plot shown in the scale is the number of milliseconds elapsed from 00:00:00 UTC, 1 January, 1970, until the bar's opening time.
  It corresponds to 17:30 on the 27th of September 2021. However, because the chart is using the UTC-4 time zone (the NASDAQ's time zone),
  it is displaying the 13:30 time, four hours earlier than UTC time.
- The difference between the two values on the last bar is the number of milliseconds in one hour (1000 * 60 * 60 = 3,600,000)
  because we are on a 1H chart.


.. note::

   - The `time <https://www.tradingview.com/pine-script-reference/v5/#var_time>`__ and
     `time_close <https://www.tradingview.com/pine-script-reference/v5/#var_time_close>`__ variables
     returns a timestamp in `UNIX time <https://en.wikipedia.org/wiki/Unix_time>`__, which is independent of the timezone selected by the user on his chart.
     In this case, the **chart's** time zone setting is the exchange time zone, so whatever symbol is on the chart, 
     its exchange time zone will be used for the display of the date and time values on the chart's cursor.
     The NASDAQ's time zone is UTC-4, but this only affects the chart's display of date/time values; it has no impact on the
     values plotted by the script.
   - The last `time <https://www.tradingview.com/pine-script-reference/v5/#var_time>`__
     value for the plot shown in the scale is the number of milliseconds elapsed from 00:00:00 UTC, 1 January, 1970, until the bar's opening time.
     It corresponds to 17:30 on the 27th of September 2021. However, because the chart is using the UTC-4 time zone (the NASDAQ's time zone),
     it is displaying the 13:30 time, four hours earlier than UTC time.
   - The difference between the two values on the last bar is the number of milliseconds in one hour (1000 * 60 * 60 = 3,600,000)
     because we are on a 1H chart.


Pine Script™ small logo with macro
==================================

|TVLogoHeader|



Tests
=====

Alerts page with page reference below header: 
:ref:`Alerts faq <PageAlertsFaq>`

Conditions page with page reference above header:
:ref:`Conditions faq <PageConditionsFaq>`

Texttext Texttext Texttext Texttext Texttext Texttext Texttext Texttext Texttext 
Texttext Texttext Texttext Texttext Texttext Texttext Texttext Texttext 
Texttext Texttext Texttext Texttext Texttext Texttext Texttext Texttext Texttext Texttext Texttext 


Header 1.1
----------

Header 1.1.1
~~~~~~~~~~~~

Header 1.1.1.1
""""""""""""""

file directive :file:`/etc/passwd`

kbd directive :kbd:`ctrl` + :kbd:`s`



Animated GIF
""""""""""""

.. image:: /images/Test-GIF-01.gif

   


Macro tests
"""""""""""

Inline macro here:

Before inline macro: |tvlogofooter| After inline macro

Macro here:

|tvlogofooter|



Footer with /images/TradingView-Logo-Block and no width/align
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

.. image:: /images/logo/TradingView_Logo_Block.svg



Footer with images/TradingView-Logo-Block
"""""""""""""""""""""""""""""""""""""""

.. image:: /images/logo/TradingView_Logo_Block.svg
    :width: 400px
    :align: center


