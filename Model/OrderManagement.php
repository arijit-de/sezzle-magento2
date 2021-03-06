<?php
/*
 * @category    Sezzle
 * @package     Sezzle_Sezzlepay
 * @copyright   Copyright (c) Sezzle (https://www.sezzle.com/)
 */

namespace Sezzle\Sezzlepay\Model;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\Exception\CouldNotSaveException;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Exception\NotFoundException;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Quote\Model\Quote;
use Sezzle\Sezzlepay\Model\Order\SaveHandler;
use Sezzle\Sezzlepay\Api\OrderManagementInterface;

/**
 * Class OrderManagement
 * @package Sezzle\Sezzlepay\Model
 */
class OrderManagement implements OrderManagementInterface
{

    /**
     * @var CartRepositoryInterface
     */
    protected $cartRepository;
    /**
     * @var
     */
    private $saveHandler;

    /**
     * Payment constructor.
     * @param CartRepositoryInterface $cartRepository
     */
    public function __construct(
        CartRepositoryInterface $cartRepository
    ) {
        $this->cartRepository = $cartRepository;
    }

    /**
     * @inheritDoc
     */
    public function createCheckout($cartId, $createSezzleCheckout)
    {
        try {
            /** @var Quote $quote */
            $quote = $this->cartRepository->getActive($cartId);
            if (!$quote) {
                throw new NotFoundException(__("Cart ID is invalid."));
            }
            return $this->getSaveHandler()->createCheckout($quote, $createSezzleCheckout);
        } catch (NoSuchEntityException $e) {
            throw new CouldNotSaveException(
                __($e->getMessage()),
                $e
            );
        } catch (NotFoundException $e) {
            throw new CouldNotSaveException(
                __($e->getMessage()),
                $e
            );
        } catch (LocalizedException $e) {
            throw new CouldNotSaveException(
                __($e->getMessage()),
                $e
            );
        }
    }

    /**
     * @inheritDoc
     */
    public function placeOrder($cartId)
    {
        /** @var Quote $quote */
        $quote = $this->cartRepository->getActive($cartId);
        if (!$quote) {
            throw new NotFoundException(__("Cart ID is invalid."));
        }
        try {
            return $this->getSaveHandler()->save($quote);
        } catch (CouldNotSaveException $e) {
            throw new CouldNotSaveException(
                __($e->getMessage()),
                $e
            );
        } catch (NoSuchEntityException $e) {
            throw new CouldNotSaveException(
                __($e->getMessage()),
                $e
            );
        }
    }

    /**
     * Get Save Handler
     *
     * @return SaveHandler
     */
    private function getSaveHandler()
    {
        if (!$this->saveHandler) {
            $this->saveHandler = ObjectManager::getInstance()->get(SaveHandler::class);
        }
        return $this->saveHandler;
    }
}
