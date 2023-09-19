import { cartArr } from "./cartItems.js"
import { getTotalCount, getFinalPrice } from "./cart.js"
import { selectWord } from "./utils/selectWord.js"
import { formatNumberSpace } from "./utils/formatNumberSpace.js"

// Открытие модальных окон
function modal() {
	// Modal
	const modalBtns = document.querySelectorAll("*[data-modal-btn]")
	const body = document.querySelector("body")
	const lockPadding = document.querySelectorAll(".lock-padding")

	let unlock = true

	const timeout = 300

	if (modalBtns.length > 0) {
		modalBtns.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				const name = btn.getAttribute("data-modal-btn")
				let modal = document.querySelector(`[data-modal-window=${name}]`)
				openModal(modal)
			})
		})
	}
	const closeModalIcon = document.querySelectorAll(".modal__close")
	if (closeModalIcon.length > 0) {
		closeModalIcon.forEach((icon) => {
			icon.addEventListener("click", (e) => {
				closeModal(icon.closest(".modal"))
			})
		})
	}
	document.addEventListener("keydown", (e) => {
		if (e.code === "Escape") {
			const modalActive = document.querySelector(".modal.show")
			closeModal(modalActive)
		}
	})
	function openModal(currentModal) {
		if (currentModal && unlock) {
			const modalActive = document.querySelector(".modal.show")
			if (modalActive) {
				closeModal(modalActive, false)
			} else {
				bodyLock()
			}
			currentModal.classList.add("show")
			currentModal.addEventListener("click", (e) => {
				if (!e.target.closest(".modal__content")) {
					closeModal(e.target.closest(".modal"))
				}
			})
		}
	}
	function closeModal(modalActive, doUnlock = true) {
		if (unlock) {
			modalActive.classList.remove("show")
			if (doUnlock) {
				bodyUnlock()
			}
		}
	}
	// Функции от смещения контента при открытии модальных окон
	function bodyLock() {
		const lockPaddingValue =
			window.innerWidth - document.querySelector("body").offsetWidth + "px"
		body.style.paddingRight = lockPaddingValue
		body.classList.add("lock")

		unlock = false
		setTimeout(function () {
			unlock = true
		}, timeout)
	}

	function bodyUnlock() {
		setTimeout(function () {
			if (lockPadding.length > 0) {
				lockPadding.forEach((lock) => {
					lock.style.paddingRight = "0px"
				})
			}
			body.style.paddingRight = "0px"
			body.classList.remove("lock")
		}, timeout)
		unlock = false
		setTimeout(() => {
			unlock = true
		}, timeout)
	}
}

modal()
// Валидация формы получателя
const formValidate = () => {
	const form = document.querySelector(".main__form")

	const regExpEmail = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i
	const regExpPhone = /^\+\d\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/
	const regExpCode = /^[1-9]+[0-9]{13}$/

	const validate = (elem) => {
		if (elem.name === "name") {
			if (elem.value === "") {
				elem.nextElementSibling.textContent = "Укажите имя"
				elem.classList.add("error")
			} else {
				elem.nextElementSibling.textContent = ""
				elem.classList.remove("error")
			}
		}

		if (elem.name === "email") {
			if (!regExpEmail.test(elem.value) && elem.value !== "") {
				elem.nextElementSibling.textContent =
					"Проверьте адрес электронной почты"
				elem.classList.add("error")
			} else if (elem.value == "") {
				elem.nextElementSibling.textContent = "Укажите электронную почту"
				elem.classList.add("error")
			} else {
				elem.nextElementSibling.textContent = ""
				elem.classList.remove("error")
			}
		}

		if (elem.name === "surname") {
			if (elem.value == "") {
				elem.nextElementSibling.textContent = "Укажите фамилию"
				elem.classList.add("error")
			} else {
				elem.nextElementSibling.textContent = ""
				elem.classList.remove("error")
			}
		}

		if (elem.name === "phone") {
			if (!regExpPhone.test(elem.value) && elem.value !== "") {
				elem.nextElementSibling.textContent = "Формат: +9 999 999 99 99"
				elem.classList.add("error")
			} else if (elem.value === "") {
				elem.nextElementSibling.textContent = "Укажите номер телефона"
				elem.classList.add("error")
			} else {
				elem.nextElementSibling.textContent = ""
				elem.classList.remove("error")
			}
		}

		if (elem.name === "code") {
			if (!regExpCode.test(elem.value) && elem.value !== "") {
				elem.nextElementSibling.textContent = "Проверьте ИНН"
				elem.classList.add("error")
			} else if (elem.value === "") {
				elem.nextElementSibling.textContent = "Укажите ИНН"
				elem.classList.add("error")
			} else {
				elem.nextElementSibling.textContent = ""
				elem.classList.remove("error")
			}
		}
	}
	// Форматирование инпут Phone
	function maskInputNumber(num) {
		let maskString = ""
		let currentEl = 1

		for (let i = 0; i < num.length; i++) {
			if (currentEl === 1) {
				maskString += "+"
			} else if (
				currentEl === 2 ||
				currentEl === 5 ||
				currentEl === 8 ||
				currentEl === 10
			) {
				maskString += " "
			}
			currentEl++
			maskString += num[i]
		}
		return maskString
	}
	function handleTelInputChange(input) {
		const inputValue = input.value.replace(/\D/g, "")
		let maskString = maskInputNumber(inputValue)
		input.value = maskString
	}

	//   слушатели
	for (let elem of form.elements) {
		elem.addEventListener("blur", () => {
			validate(elem)
		})
		if (elem.name === "phone") {
			elem.addEventListener("input", () => handleTelInputChange(elem))
		}
	}
}

formValidate()

// Скрытие карточек товара
function hideProducts() {
	const btns = document.querySelectorAll(".cart__btn-hide-item")

	btns.forEach((btn) => {
		const productItems = btn.closest(
			".cart__choose-all-wrapper"
		).nextElementSibling

		btn.addEventListener("click", () => hideCartItems(btn, productItems))
	})

	function hideCartItems(btn, items) {
		const checkbox = btn
			.closest(".cart__choose-all-wrapper")
			.querySelector(".cart__choose-all-wrapper-checkbox")
		const productsCount = btn
			.closest(".cart__choose-all-wrapper")
			.querySelector(".cart__choose-all-hide-info")
		const countItems = document.querySelector(
			".cart__choose-all-hide-info-count"
		)
		const fullPrice = document.querySelector(
			".cart__choose-all-hide-info-fullprice"
		)
		items.classList.toggle("hide")
		btn.classList.toggle("rotate")
		if (checkbox && productsCount) {
			checkbox.classList.toggle("hide")
			productsCount.classList.toggle("hide")
		}
		updateProductInfo(countItems, fullPrice)
	}
	function updateProductInfo(countElement, priceElement) {
		countElement.textContent = `${getTotalCount()} ${selectWord(
			getTotalCount(),
			["товар", "товара", "товаров"]
		)} · `
		priceElement.textContent = `${formatNumberSpace(getFinalPrice(), " ")} сом`
	}
}
hideProducts()
// Создание и показ банера со скидками
function showDiscountBanner() {
	document.addEventListener("DOMContentLoaded", () => {
		const cardItems = document.querySelectorAll(".discount__helper-wrap")

		cardItems.forEach(createDiscountBanner)
	})

	function createDiscountBanner(discountBanner) {
		const id = discountBanner.closest(".cart__item").dataset.id
		const item = cartArr.items.find((item) => item.id == id)
		const discountBannerFirstRowValue = discountBanner.querySelector(
			".discount__helper-row-first-value"
		)
		const discountBannerSecondRowValue = discountBanner.querySelector(
			".discount__helper-row-second-value"
		)
		discountBannerFirstRowValue.textContent = `−${Math.round(
			item.price.original * item.discountsArr[0].value
		)} сом`
		discountBannerSecondRowValue.textContent = `−${Math.round(
			item.price.original * item.discountsArr[1].value
		)} сом`
	}
}

showDiscountBanner()
