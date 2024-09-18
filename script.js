//历史记录下拉菜单实现 Start
const Input = document.querySelector('.bing-bar-input')
const HistoryContainer = document.querySelector('#history')

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('History')) || []
  return history;
}

function updateInputBorderRadius(historyLength, filteredLength) {
  if (historyLength === 0 || filteredLength === 0) {
    Input.style.borderRadius = '15px';  // 四个圆角
  } else {
    Input.style.borderRadius = '15px 15px 0 0';  // 仅上圆角
  }
}

function adjustHistoryHeight(filteredHistoryLength) {
  const itemHeight = 46;  // 每条记录的高度
  const maxVisibleItems = 8;
  if (filteredHistoryLength <= maxVisibleItems) {
    HistoryContainer.style.height = `${filteredHistoryLength * itemHeight}px`;
  } else {
    HistoryContainer.style.height = `${maxVisibleItems * itemHeight}px`;  // 固定为240px
    HistoryContainer.style.overflowY = 'auto';  // 启用滚动条
  }
}

function removeHistory(item) {
  let history = loadHistory()
  history = history.filter(i => i !== item)
  localStorage.setItem('History', JSON.stringify(history))
}

function ShowHistory() {
  const history = loadHistory()
  const query = Input.value.trim().toLowerCase()

  if (history.length === 0) {
    HistoryContainer.style.display = 'none'
    Input.style.borderRadius = '15px'
    return;
  }

  HistoryContainer.innerHTML = ''

  const filteredHistory = history.filter(item => item.toLowerCase().includes(query))

  if (filteredHistory.length === 0) {
    HistoryContainer.style.display = 'none'
    Input.style.borderRadius = '15px'
    return
  }

  updateInputBorderRadius(history.length, filteredHistory.length);

  filteredHistory.forEach(item => {
    const div = document.createElement('div')
    div.classList.add('history-item')

    const span = document.createElement('span')
    span.classList.add('writtenWords')
    span.textContent = item
    span.style.display = 'block'


    const deleteIcon = document.createElement('div')
    deleteIcon.classList.add('delete')

    const iconImage = document.createElement('img')
    iconImage.src = './image/delete.png'
    iconImage.alt = 'delete icon'
    iconImage.classList.add('delete-icon')

    deleteIcon.appendChild(iconImage)

    div.appendChild(span)
    div.appendChild(deleteIcon)

    HistoryContainer.appendChild(div)

    div.onclick = () => {
      Input.value = item
      HistoryContainer.style.display = 'none'
      Input.style.borderRadius = '15px'

    }

    deleteIcon.onclick = (e) => {
      e.stopPropagation()
      removeHistory(item)
      div.remove()
    }

  })

  adjustHistoryHeight(filteredHistory.length)

  HistoryContainer.style.display = 'block'

}



function saveHistory(query) {
  let history = loadHistory()
  if (!history.includes(query)) {
    history.unshift(query)
    if (history.length > 50) {
      history.pop()
    }
    localStorage.setItem('History', JSON.stringify(history))
  }
}

document.getElementById('bing-search-form').addEventListener('submit', function (event) {
  const query = Input.value.trim()
  if (query !== '') {
    saveHistory(query)
  }
})

Input.addEventListener('focus', ShowHistory)
Input.addEventListener('input', ShowHistory)

document.addEventListener('click', function (event) {
  if (!Input.contains(event.target) && !HistoryContainer.contains(event.target)) {
    HistoryContainer.style.display = 'none'
  }
})



//历史记录下拉菜单实现 End

//bing 和 bing-bar-input的组合阴影效果
const BingBarInput = document.querySelector('.bing-bar-input')
BingBarInput.addEventListener('focus', function () {
  HistoryContainer.style.boxShadow = '20px 30px 40px rgba(126, 126, 126, 0.3)'
})

//bing 和 bing-bar-input的组合动态效果
Input.addEventListener('blur', function () {
  Input.style.transition = 'border-radius 0.5s ease'
  Input.style.borderRadius = '15px' // 恢复到失去焦点时的样式
});

Input.addEventListener('focus', function () {
  Input.style.transition = 'border-radius 0s ease'
});