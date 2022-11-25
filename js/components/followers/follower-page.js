import userDetails from './follower-user.js'
import followerItem from './follower-item.js'

const followerComponent = (userData) => {

const followerBtn = document.querySelector('#follower__btn')

	const fetchFollowers = async() => {

		const userFollowers = await fetch(userData.followers_url)
							.then(res => res)
							.then(data => data.json())
		console.log(userFollowers)
		return userFollowers
	}

	followerBtn.addEventListener('click', async() => {
		const results = await fetchFollowers()
		const followerContainer = document.createElement('div')
		// followerContainer.id = 'follower__container'

		const rootElem = document.querySelector('#root')
		rootElem.innerHTML = ''
		rootElem.innerHTML = `<button id="back__btn" onclick="display()"><i class="fas fa-arrow-left"></i></button> ${userDetails(userData, results, 'Followers')}`


		let state = {
			'repos' : results,
			'page' : 1,
			'rows' : 10,
			'window':5
		}
	
		const  pagination = (QurySet,Page,Rows)=>{
	
			let trimStart = (Page -1 ) * Rows;
			let trimEnd = trimStart + Rows;
	
			console.log(trimStart,trimEnd)
			let trimmedData = QurySet.slice(trimStart,trimEnd)
	
			let pages = Math.round(QurySet.length / Rows)
	
			return {
				'querySet' : trimmedData,
				'pages' : pages
			}
		}
		const bindEvent = ()=>{
			document.querySelectorAll('.page').forEach((btn)=>{
				btn.addEventListener('click',(event)=>{
					console.log(event.target)
						state.page = Number(event.target.value)
						buildTable()
				});
			})
		}
		const PageButton = (pages) => {
			let wrapper = document.createElement('div')

			wrapper.id = "paginationCenter";
			wrapper.innerHTML = ``;
	
			let maxLeft = (state.page - Math.floor(state.window / 2))
			let maxRight = (state.page + Math.floor(state.window / 2))
		
			if (maxLeft < 1) {
				maxLeft = 1
				maxRight = state.window
			}
		
			if (maxRight > pages) {
				maxLeft = pages - (state.window - 1)
				
				if (maxLeft < 1){
					maxLeft = 1
				}
				maxRight = pages
			}
			for (let page = maxLeft; page <= maxRight; page++) {
				wrapper.innerHTML += `<button value=${page} 
				class="page ">${page}</button>`
			}
		
			if (state.page != 1) {
				wrapper.innerHTML = `<button value=${1} 
				class="page ">&#171; First</button>` + wrapper.innerHTML
			}
		
			if (state.page != pages) {
				wrapper.innerHTML += `<button value=${pages} 
				class="page ">Last &#187;</button>`
			}
		
			followerContainer.innerHTML += wrapper.outerHTML;
			bindEvent()
		}
		const buildTable= ()=>{
			const repoDiv = document.createElement('div')
			repoDiv.id = "follower__container"
			followerContainer.innerHTML= ""
			let data = pagination(state.repos,state.page,state.rows)
			for(let result of data.querySet){
				repoDiv.innerHTML += followerItem(result)

		   }
		   followerContainer.appendChild(repoDiv)
		   PageButton(data.pages)
		   console.log(state)
		}
		buildTable()

	rootElem.append(followerContainer)
	
	bindEvent()
		// const showFollowers = () => {
		// 	for(let result of results){
		// 		 followerContainer.innerHTML += followerItem(result)
		// 	}
		// }

		// showFollowers()

		// rootElem.append(followerContainer)
	})

}

export default followerComponent