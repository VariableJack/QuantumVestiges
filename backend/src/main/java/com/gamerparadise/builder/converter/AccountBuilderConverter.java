package com.gamerparadise.builder.converter;
import org.springframework.stereotype.Component;

import lombok.NonNull;

import com.gamerparadise.component.dto.OrderComponentDTO;
import com.gamerparadise.component.dto.OrderItemComponentDTO;
import com.gamerparadise.component.dto.PurchasedItemComponentDTO;
import com.gamerparadise.dao.dto.OrderDAODTO;
import com.gamerparadise.dao.dto.OrderItemDAODTO;
import com.gamerparadise.dao.dto.PurchasedItemDAODTO;

@Component
public class AccountBuilderConverter {
    public OrderComponentDTO convertOrderDAODTOToComponentDTO(@NonNull OrderDAODTO input) {
        return OrderComponentDTO.builder()
            .orderId(input.getOrderId())
            .username(input.getUsername())
            .orderStatus(input.getOrderStatus())
            .totalPurchasePrice(input.getTotalPurchasePrice())
            .createTime(input.getCreateTime())
            .checkoutTime(input.getCheckoutTime())
            .refundTime(input.getRefundTime())
            .items(input.getItems().stream().map((item) -> this.convertOrderItemDAODTOToComponentDTO(item)).toList())
            .build();
    }

    public OrderItemComponentDTO convertOrderItemDAODTOToComponentDTO(@NonNull OrderItemDAODTO input) {
        return OrderItemComponentDTO.builder()
            .orderItemId(input.getOrderItemId())
            .orderId(input.getOrderId())
            .productId(input.getProductId())
            .productName(input.getProductName())
            .franchiseName(input.getFranchiseName())
            .purchasePrice(input.getPurchasePrice())
            .quantity(input.getQuantity())
            .build();
    }

    public OrderDAODTO convertOrderComponentDTOToDAODTO(@NonNull OrderComponentDTO input) {
        return OrderDAODTO.builder()
            .orderId(input.getOrderId())
            .username(input.getUsername())
            .orderStatus(input.getOrderStatus())
            .totalPurchasePrice(input.getTotalPurchasePrice())
            .createTime(input.getCreateTime())
            .items(input.getItems().stream().map((item) -> this.convertOrderItemComponentDTOToDAODTO(item)).toList())
            .build();
    }

    public OrderItemDAODTO convertOrderItemComponentDTOToDAODTO(@NonNull OrderItemComponentDTO input) {
        return OrderItemDAODTO.builder()
            .orderItemId(input.getOrderItemId())
            .orderId(input.getOrderId())
            .productId(input.getProductId())
            .productName(input.getProductName())
            .purchasePrice(input.getPurchasePrice())
            .quantity(input.getQuantity())
            .build();
    }

    public PurchasedItemDAODTO convertOrderComponentDTOToPurchasedItemDAODTO(@NonNull OrderItemComponentDTO input) {
        return PurchasedItemDAODTO.builder()
            .productId(input.getProductId())
            .build();
    }

    public PurchasedItemComponentDTO convertPurchasedItemDAODTOToComponentDTO(@NonNull PurchasedItemDAODTO input) {
        return PurchasedItemComponentDTO.builder()
            .username(input.getUsername())
            .productId(input.getProductId())
            .productName(input.getProductName())
            .productType(input.getProductType())
            .franchiseId(input.getFranchiseId())
            .franchiseName(input.getFranchiseName())
            .build();
    }
}
