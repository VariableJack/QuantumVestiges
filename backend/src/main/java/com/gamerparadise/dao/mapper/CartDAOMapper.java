package com.gamerparadise.dao.mapper;

import org.springframework.stereotype.Component;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import lombok.NonNull;
import java.util.List;
import com.gamerparadise.dao.dto.CartDAODTO;

@Component
@Mapper
public interface CartDAOMapper {
	public List<CartDAODTO> getCart(@Param("username") @NonNull String username);
	public void insertItem(@Param("cartItem") @NonNull CartDAODTO cartItem);
	public void removeItem(@Param("cartItem") @NonNull CartDAODTO cartItem);
	public void clearCart(@Param("username") @NonNull String username);
}
