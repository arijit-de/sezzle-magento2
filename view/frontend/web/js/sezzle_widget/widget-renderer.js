/*
 * @category    Sezzle
 * @package     Sezzle_Payment
 * @copyright   Copyright (c) Sezzle (https://www.sezzle.com/)
 */
define([
    'jquery',
    'ko',
    'uiComponent',
    'sezzleWidgetCore',
    'domReady!'
], function ($, ko, Component) {
    'use strict';

    return Component.extend({
        initialize: function () {
            this._super();
            this.processSezzleDocument();
        },

        processSezzleDocument: function() {
            const renderSezzle = new AwesomeSezzle({
                amount: this.price,
                alignment: this.alignment
            });
            renderSezzle.init();
            // console.log("rendering started");
            //
            // if (!this.merchant_id) {
            //     console.warn('Sezzle: merchant id not set, cannot render widget');
            //     return;
            // }
            //
            // var script = document.createElement('script');
            // script.type = 'text/javascript';
            // script.src = 'https://widget.sezzle.com/v1/javascript/price-widget?uuid=' + this.merchant_id;
            // $("head").append(script);
            //
            // console.log("dom loaded");
        }
    });
});
