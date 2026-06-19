package com.gamerparadise.dao.mapper;

import org.springframework.stereotype.Component;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import lombok.NonNull;
import java.util.List;

import com.gamerparadise.dao.dto.OrderDAODTO;
import com.gamerparadise.dao.dto.OrderItemDAODTO;
import com.gamerparadise.dao.dto.PurchasedItemDAODTO;

@Component
@Mapper
public interface AccountDAOMapper {
    public void createOrder(@Param("username") @NonNull String username);
    public OrderDAODTO getOrder(@Param("username") @NonNull String username);
    public void insertItem(@Param("item") @NonNull OrderItemDAODTO item);
    public void removeItem(@Param("item") @NonNull OrderItemDAODTO item);
    public void closeOrder(@Param("orderId") @NonNull long orderId, @Param("status") @NonNull String status);
    public void addItemsToAccount(@Param("items") @NonNull List<PurchasedItemDAODTO> input, @Param("username") @NonNull String username);
    public List<PurchasedItemDAODTO> getPurchasedItems(@Param("username") @NonNull String username);
}
