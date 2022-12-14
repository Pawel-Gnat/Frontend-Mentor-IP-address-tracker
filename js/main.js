const searchInput = document.querySelector('.searchbox__input')
const searchBtn = document.querySelector('.searchbox__btn')
const errorContainer = document.querySelector('.error-container')

function getIPAddress() {
	const ipRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/gm
	const domainRegex =
		/^(((?!\-))(xn\-\-)?[a-z0-9\-_]{0,61}[a-z0-9]{1,1}\.)*(xn\-\-)?([a-z0-9\-]{1,61}|[a-z0-9\-]{1,30})\.[a-z]{2,}$/gim

	if (ipRegex.test(searchInput.value) || domainRegex.test(searchInput.value)) {
		sendURLtoAPI(searchInput.value)
		searchInput.value = ''
	} else {
		handleError('Wrong domain or IP address. Paste domain without http://.')
	}
}

function sendURLtoAPI(IP) {
	const url = `https://ipapi.co/${IP}/json/`
	getInformationsFromIP(url)
}

function displayAddressInformation(IP, location, timezone, ISP) {
	let [IPAddressInformation, locationInformation, timezoneInformation, ISPInformation] =
		document.querySelectorAll('.infobox__result')
	IPAddressInformation.textContent = IP
	locationInformation.textContent = location
	timezoneInformation.textContent = timezone
	ISPInformation.textContent = ISP
}

const getInformationsFromIP = async (url = 'https://ipapi.co/json/') => {
	try {
		const response = await fetch(url)
			.then(response => response.json())
			.then(data => {
				let latitude = data.latitude
				let longitude = data.longitude
				let IPaddress = data.ip
				let location = data.city + ', ' + data.country_name + ' ' + data.postal
				let timezone = data.timezone
				let ISP = data.org

				displayMap(latitude, longitude)
				displayAddressInformation(IPaddress, location, timezone, ISP)
			})
	} catch (e) {
		handleError('Too many requests, please try again later.')
	}
}

const displayMap = async (latitude, longitude) => {
	try {
		let coordinates = [`${latitude}`, `${longitude}`]
		let map = L.map('map').setView(coordinates, 13)

		let openStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		})
		openStreetMap.addTo(map)

		let locationIcon = L.icon({
			iconUrl: './images/icon-location.svg',

			iconSize: [45, 55],
			iconAnchor: [0, 0],
		})
		let marker = L.marker(coordinates, { icon: locationIcon }).addTo(map)
	} catch (e) {
		handleError('Something went wrong with map API.')
	}
}

function handleError(error) {
	let errorText = errorContainer.querySelector('p')
	errorContainer.classList.add('active')
	errorText.textContent = error

	setTimeout(() => {
		errorContainer.classList.remove('active')
	}, 1000)
}

window.onload = () => {
	setTimeout(() => {
		getInformationsFromIP()
	}, 1500)
}

searchBtn.addEventListener('click', getIPAddress)
document.addEventListener('keydown', e => {
	if (e.code === 'Enter') {
		getIPAddress()
	}
})
