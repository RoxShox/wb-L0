import { selectWord } from "./utils/selectWord.js"
import { formatNumberSpace } from "./utils/formatNumberSpace.js"
import { cartArr } from "./cartItems.js"

// Обработчик всех карточек товар
const items = document.querySelectorAll(".cart__item")
items.forEach((item) => {
	const itemInput = item.querySelector(".input-checkbox")
	itemInput.addEventListener("change", () => toggleCartItemCheckbox(item))
})

// Выбор всех товаров
const chooseAllCheckbox = document.querySelector("#choose-all")
chooseAllCheckbox.addEventListener("change", () => {
	const isChecked = chooseAllCheckbox.checked
	if (isChecked) {
		items.forEach((item) => {
			const itemInput = item.querySelector(".input-checkbox")

			if (itemInput.checked) return

			itemInput.checked = true
			toggleCartItemCheckbox(item, true)
		})
	} else {
		items.forEach((item) => {
			const itemInput = item.querySelector(".input-checkbox")

			if (!itemInput.checked) return

			itemInput.checked = false
			toggleCartItemCheckbox(item, false)
		})
	}
})

// Выбор(отмена) отдельного товара
function toggleCartItemCheckbox(card, selectMode) {
	const cardID = card.dataset.id
	const cardState = cartArr.items.find((item) => item.id == cardID)
	if (!cardState) return

	if (selectMode === undefined) {
		const newState = !cardState.isSelected
		cardState.isSelected = newState

		if (newState) {
			selectProduct(cardID)
		} else {
			canselProduct(cardID)
		}
	} else {
		if (selectMode) {
			cardState.isSelected = true
			selectProduct(cardID)
		} else {
			cardState.isSelected = false
			canselProduct(cardID)
		}
	}

	handleSelectAllCheckbox(chooseAllCheckbox)
	// updateShippingDate()
	updateTotalPrice()
}

//Обработчик все счетчиков
const counters = document.querySelectorAll(".cart__item-counter")
counters.forEach((counter) => {
	const input = counter.querySelector(".counter__value")
	const btns = counter.querySelectorAll("[data-direction]")

	btns.forEach((btn) => {
		btn.addEventListener("click", function (e) {
			const direction = e.target.closest(".counter__btn").dataset.direction
			if (direction === "plus") {
				increaseCount(e)
			} else {
				decreaseCount(e)
			}
		})
	})

	input.onchange = handleCountChange
})

// Обработчик изменения количества товара
export function handleCountChange(event) {
	const cardID = event.target.closest(".cart__item").dataset.id
	const maxValue = cartArr.items.find((product) => product.id == cardID)?.stock

	if (event.target.value == "" || event.target.value == 0) {
		event.target.value = 1
	} else if (event.target.value > maxValue) {
		event.target.value = maxValue
	} else {
		event.target.value = parseInt(event.target.value)
	}

	changeCardCount(cardID, event.target.value)
}

// Удаление товаров
const deleteButtons = document.querySelectorAll(
	".cart__item-functional-button-delete"
)
deleteButtons.forEach((button) =>
	button.addEventListener("click", deleteProduct)
)

// Функция удаления товара
function deleteProduct(e) {
	const cardElement =
		e.target.closest(".cart__item") || e.target.closest(".absent__item")

	const cardID = cardElement?.dataset.id

	if (cardID) {
		cartArr.items = cartArr.items.filter((product) => product.id != cardID)

		canselProduct(cardID)
		updateCartLabels()
		updateTotalPrice()
	} else {
		const absentTitle = document.querySelector(".absent__quantity-title")
		const absentNumber = document.querySelector(".absent__quantity-count")
		const absentText = document.querySelector(".absent__quantity-text")
		const currentNumber = absentNumber.textContent
		const newNumber = currentNumber - 1

		absentTitle.textContent = selectWord(newNumber, [
			"Отсутствует",
			"Отсутствуют",
			"Отсутствуют",
		])
		absentNumber.textContent = newNumber
		absentText.textContent = selectWord(newNumber, [
			"товар",
			"товара",
			"товаров",
		])
	}

	cardElement.remove()
}

// Выбор (отмена) показа фул прайса на кнопке в итоговой корзине
function checkPayment() {
	const checkbox = document.querySelector(".input-check-pay-immediately")
	const unchekedBtnText = document.querySelector(".basket-card__btn-unchecked")
	const chekedBtnText = document.querySelector(".basket-card__btn-checked")
	const bannerWrap = document.querySelector(
		".basket-card__pay-banner-checkbox-wrap"
	)
	const checkboxBannerText = document.querySelector(
		".basket-card__pay-banner-descr"
	)
	checkbox.addEventListener("change", () => {
		if (checkbox.checked) {
			unchekedBtnText.classList.add("hide")
			chekedBtnText.classList.add("show")
			checkboxBannerText.classList.add("hide")
			bannerWrap.style.marginBottom = "0px"
		} else {
			unchekedBtnText.classList.remove("hide")
			chekedBtnText.classList.remove("show")
			checkboxBannerText.classList.remove("hide")
		}
	})
}
checkPayment()

function handlerCount(e, btnDirection) {
	const id = e.target.closest(".cart__item").dataset.id
	const input = e.target.closest(".cart__item").querySelector(".counter__value")
	const maxValue = cartArr.items.find((item) => item.id == id)?.stock
	// const maxValueLength = parseInt(input.getAttribute("maxlength"))
	const currentValue = +input.value

	let newValue = btnDirection ? currentValue + 1 : currentValue - 1
	if (newValue >= 1 && newValue <= maxValue) {
		input.value = newValue
		changeCardCount(id, newValue)
	}
}
// Функция для увеличения количества товара
function increaseCount(e) {
	handlerCount(e, true)
}

// Функция для уменьшения количества товара
function decreaseCount(e) {
	handlerCount(e, false)
}

// Обновление иконок с количеством товара в корзине
function updateCartLabels() {
	const cartLabel = document.querySelector(".header__button-cart-count")
	const cartLabelMobile = document.querySelector(
		".footer__mobile-navigation .header__button-cart-count"
	)
	const itemsRemains = cartArr.items.length

	cartLabel.textContent = itemsRemains
	cartLabelMobile.textContent = itemsRemains
}

// Обновление общей стоимости
function updateTotalPrice() {
	const fullPrice = document.querySelector("#final-price")
	const fullCountText = document.querySelector("#final-count-items")
	const fullCountTextEl = document.querySelector("#final-count-items-text")
	const priceOriginalElement = document.querySelector("#full-price-items")
	const priceDiscountElement = document.querySelector("#discount-items")
	const chekedBtnText = document.querySelector(".basket-card__btn-checked")

	const selecteditems = cartArr.items.filter((item) => item.isSelected)

	if (selecteditems.length > 0) {
		const totalDiscountedPrice = selecteditems.reduce(
			(acc, { price: { discounted }, count, discountsArr }) => {
				return (acc += discounted * count)
			},
			0
		)
		const totalOriginalPrice = selecteditems.reduce(
			(acc, { price: { original }, count }) => {
				return (acc += original * count)
			},
			0
		)
		const totalCount = selecteditems.reduce((acc, { count }) => {
			return (acc += +count)
		}, 0)
		const discount = totalDiscountedPrice - totalOriginalPrice
		fullPrice.textContent = `${formatNumberSpace(totalDiscountedPrice)} сом`
		chekedBtnText.textContent = `Оплатить ${formatNumberSpace(
			totalDiscountedPrice
		)} сом`
		fullCountText.textContent = formatNumberSpace(totalCount)
		fullCountTextEl.textContent = selectWord(totalCount, [
			"товар",
			"товара",
			"товаров",
		])
		priceOriginalElement.textContent = formatNumberSpace(totalOriginalPrice)
		priceDiscountElement.textContent = formatNumberSpace(discount)

		// document.querySelector(
		// 	".main__total-submit"
		// ).textContent = `Оплатить ${formatNumberSpace(totalDiscountedPrice)} сом`
	} else {
		fullPrice.textContent = 0
		fullCountText.textContent = 0
		priceOriginalElement.textContent = 0
		priceDiscountElement.textContent = 0

		// document.querySelector(
		// 	".main__total-submit"
		// ).textContent = `Оплатить ${0} сом`
	}
}

updateTotalPrice()

// Получение итоговой цены
export function getFinalPrice() {
	return cartArr.items
		.filter((item) => item.isSelected)
		.reduce((acc, { price: { discounted }, count }) => {
			return (acc += discounted * count)
		}, 0)
}

// Получение всех выбранных товаров
export function getTotalCount() {
	return cartArr.items
		.filter((product) => product.isSelected)
		.reduce((acc, { count }) => {
			return (acc += +count)
		}, 0)
}

// Изменение количества товара
function changeCardCount(cardID, newCount) {
	const card = cartArr.items.find((card) => card.id == cardID)
	card.count = newCount

	updatePrice(card)
	updateTotalPrice()
}

// Обновление цен на товар на странице
function updatePrice(product) {
	const currentItem = document.querySelector(
		`.cart__item[data-id='${product.id}']`
	)
	const discountedPriceEl = currentItem.querySelector(
		".cart__item-total-discount-value"
	)

	const originalPriceEl = currentItem.querySelector(".cart__item-total-price")
	const discountedPriceMobEl = currentItem.querySelector(
		".cart__item-mobile-total-price-dicsount"
	)
	const originalPriceMobEl = currentItem.querySelector(
		".cart__item-mobile-total-price-fullprice"
	)

	const newDiscountedPrice = formatNumberSpace(
		product.count * product.price.discounted
	)
	const newOriginalPrice = formatNumberSpace(
		product.count * product.price.original
	)

	discountedPriceEl.textContent = newDiscountedPrice
	originalPriceEl.textContent = `${newOriginalPrice} сом`
	discountedPriceMobEl.textContent = `${newDiscountedPrice} сом`
	originalPriceMobEl.textContent = `${newOriginalPrice} сом`
}

// Выбор товара
function selectProduct(id) {
	if (!cartArr.selectedIds.find((selectedId) => selectedId == id)) {
		cartArr.selectedIds.push(id)
	}
}

// Отмена выбора товара
function canselProduct(id) {
	cartArr.selectedIds = cartArr.selectedIds.filter(
		(selectedId) => selectedId != id
	)
}

// Обработка состояния чекбокса выбора всех товаров
function handleSelectAllCheckbox(input) {
	const isAllSelected = cartArr.selectedIds.length === cartArr.items.length

	if (isAllSelected) {
		input.checked = true
	} else {
		input.checked = false
	}
}
