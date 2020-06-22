<?php

namespace Sezzle\Payment\Block\Widget;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Block\Product\Context;
use Magento\Catalog\Block\Product\View;
use Magento\Catalog\Helper\Product;
use Magento\Catalog\Model\ProductTypes\ConfigInterface;
use Magento\Customer\Model\Session;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Locale\FormatInterface;
use Magento\Framework\Pricing\Helper\Data;
use Magento\Framework\Pricing\PriceCurrencyInterface;
use Magento\Framework\Stdlib\StringUtils;
use Magento\Framework\Url\EncoderInterface;
use Sezzle\Payment\Model\System\Config\Container\SezzleApiConfigInterface;

class PDP extends View
{

    /**
     * @var SezzleApiConfigInterface
     */
    private $sezzleApiConfig;
    /**
     * @var Data
     */
    private $pricingHelper;

    public function __construct(
        Context $context,
        EncoderInterface $urlEncoder,
        \Magento\Framework\Json\EncoderInterface $jsonEncoder,
        StringUtils $string,
        Product $productHelper,
        ConfigInterface $productTypeConfig,
        FormatInterface $localeFormat,
        Session $customerSession,
        ProductRepositoryInterface $productRepository,
        PriceCurrencyInterface $priceCurrency,
        SezzleApiConfigInterface $sezzleApiConfig,
        Data $pricingHelper,
        array $data = []
    ) {
        $this->sezzleApiConfig = $sezzleApiConfig;
        $this->pricingHelper = $pricingHelper;
        parent::__construct(
            $context,
            $urlEncoder,
            $jsonEncoder,
            $string,
            $productHelper,
            $productTypeConfig,
            $localeFormat,
            $customerSession,
            $productRepository,
            $priceCurrency,
            $data
        );
    }

    /**
     * Get Widget Script for PDP status
     *
     * @return string
     */
    public function isWidgetScriptAllowedForPDP()
    {
        try {
            return $this->sezzleApiConfig->isWidgetScriptAllowedForPDP()
                && $this->sezzleApiConfig->isEnabled()
                && $this->getItemPrice() != '';
        } catch (NoSuchEntityException $e) {
            return false;
        }
    }

    /**
     * @return string
     */
    public function getAlignment()
    {
        return "left";
    }

    public function getItemPrice()
    {
        return $this->pricingHelper->currency(
            $this->getProduct()->getFinalPrice(),
            true,
            false
        );
    }
}
