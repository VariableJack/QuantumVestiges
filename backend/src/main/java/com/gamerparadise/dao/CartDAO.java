package com.gamerparadise.dao;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import lombok.NonNull;

import java.util.List;
import java.util.Objects;

import com.gamerparadise.dao.mapper.CartDAOMapper;
import com.gamerparadise.dao.dto.CartDAODTO;

@Component
public class CartDAO {
	@Autowired
	private CartDAOMapper mapper;
	private static final Logger logger = LogManager.getLogger(GamesDAO.class);
	public List<CartDAODTO> getCart(@NonNull String username) {
		logger.info("Fetching cart for user {}", username);
		try {
			return mapper.getCart(username);
		} catch (Exception e) {
			throw e;
		}
	}

	public void insertItem(@NonNull CartDAODTO cartItem) {
		logger.info("Inserting item to cart {}", cartItem);
		try {
			mapper.insertItem(cartItem);
		} catch (Exception e) {
			throw e;
		}
	}

	public void removeItem(@NonNull CartDAODTO cartItem) {
		logger.info("Removing item from cart {}", cartItem);
		try {
			mapper.removeItem(cartItem);
		} catch (Exception e) {
			throw e;
		}
	}
	
	public void clearCart(@NonNull String username) {
		logger.info("Clearing cart for user {}", username);
		try {
			mapper.clearCart(username);
		} catch (Exception e) {
			throw e;
		}
	}
}
