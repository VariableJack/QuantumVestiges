package com.gamerparadise.activity.converter;
import org.springframework.stereotype.Component;

import lombok.NonNull;

import com.gamerparadise.activity.dto.OrderActivityDTO;
import com.gamerparadise.activity.dto.OrderItemActivityDTO;
import com.gamerparadise.activity.dto.UpdateOrderActivityInputDTO;
import com.gamerparadise.activity.dto.PurchasedItemActivityDTO;
import com.gamerparadise.component.dto.OrderComponentDTO;
import com.gamerparadise.component.dto.OrderItemComponentDTO;
import com.gamerparadise.component.dto.UpdateOrderComponentInputDTO;
import com.gamerparadise.component.dto.PurchasedItemComponentDTO;

@Component
public class AccountActivityConverter {
    public UpdateOrderComponentInputDTO convertOrderInputToComponentDTO(@NonNull UpdateOrderActivityInputDTO input) {
        return UpdateOrderComponentInputDTO
            .builder()
            .orderId(input.getOrderId())
            .productId(input.getProductId())
            .action(input.getAction())
            .quantity(input.getQuantity())
            .build();
    }

    public OrderComponentDTO convertOrderActivityDTOToComponentDTO(@NonNull OrderActivityDTO input) {
        return OrderComponentDTO.builder()
            .orderId(input.getOrderId())
            .username(input.getUsername())
            .orderStatus(input.getOrderStatus())
            .totalPurchasePrice(input.getTotalPurchasePrice())
            .items(input.getItems().stream().map((item) -> this.convertOrderItemActivityDTOToComponentDTO(item)).toList())
            .build();
    }

    public OrderItemComponentDTO convertOrderItemActivityDTOToComponentDTO(@NonNull OrderItemActivityDTO input) {
        return OrderItemComponentDTO.builder()
            .orderItemId(input.getOrderItemId())
            .orderId(input.getOrderId())
            .productId(input.getProductId())
            .productName(input.getProductName())
            .purchasePrice(input.getPurchasePrice())
            .quantity(input.getQuantity())
            .build();
    }

    public OrderActivityDTO convertOrderComponentDTOToActivityDTO(@NonNull OrderComponentDTO input) {
        return OrderActivityDTO.builder()
            .orderId(input.getOrderId())
            .username(input.getUsername())
            .orderStatus(input.getOrderStatus())
            .totalPurchasePrice(input.getTotalPurchasePrice())
            .createTime(input.getCreateTime())
            .checkoutTime(input.getCheckoutTime())
            .refundTime(input.getRefundTime())
            .items(input.getItems().stream().map((item) -> this.convertOrderItemComponentDTOToActivityDTO(item)).toList())
            .build();
    }

    public OrderItemActivityDTO convertOrderItemComponentDTOToActivityDTO(@NonNull OrderItemComponentDTO input) {
        return OrderItemActivityDTO.builder()
            .orderItemId(input.getOrderItemId())
            .orderId(input.getOrderId())
            .productId(input.getProductId())
            .productName(input.getProductName())
            .franchiseName(input.getFranchiseName())
            .purchasePrice(input.getPurchasePrice())
            .quantity(input.getQuantity())
            .build();
    }

    public PurchasedItemActivityDTO convertPurchasedItemComponentDTOToActivityDTO(@NonNull PurchasedItemComponentDTO input) {
        return PurchasedItemActivityDTO.builder()
            .username(input.getUsername())
            .productId(input.getProductId())
            .productName(input.getProductName())
            .productType(input.getProductType())
            .franchiseId(input.getFranchiseId())
            .franchiseName(input.getFranchiseName())
            .build();
    }
}