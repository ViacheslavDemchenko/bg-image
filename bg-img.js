/* Background image type choice according to the current browser and it's version */

(function (){

/* Browser webP support check */
    function testWebP(callback) {
        let webP = new Image();     
            webP.src = 'data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wAiMw' + 
                       'AgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA';
            
        webP.onload = webP.onerror = () => {
            callback(webP.height === 2);     
        }; 
    };
    
    let browser;

    testWebP(function(supported) {
        if (supported) {
            browser = true;
            console.log('Поддерживает webp');
        	return browser
        } else {
            browser = false;
            console.log('Не поддерживает webp');
        	return browser
        }
    });

/* Supported image type choice options */
    const bgImgOpt = {
    	images: 'bg-img',  // Класс элементов, в которых необходима замена картинок
        prevUrlEnd: '@1x.jpg', // Основной (jpg) формат картинок
        urlWebp1x: '@1x.webp', // WebP формат картинок для обычных экранов
        urlWebp2x: '@2x.webp', // WebP формат картинок для экранов с разрешением от 1.5 DPI
        urlJpg2x: '@2x.jpg', // Jpg формат картинок для экранов с разрешением от 1.5 DPI
    }

/* Функция выбора формата фоновых картинок в зависимости от типа браузера и разрешения экрана */
    function imageTypeChange(images, urlWebp1x, urlWebp2x, urlJpg2x, prevUrlEnd) {

            // Псевдомассив элементов с фоновыми картинками
    	let bgImages = document.querySelectorAll(`.${images}`), 
    	    // Проверка DPI экрана устройства для всех браузеров и для IE 10
    	    pixelRatio = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI,
    	    imageList, // Список текущих ссылок на фоновые картинки
            currentImage, // Текущая картинка
            newURL, // Новая ссылка для картинки
            pureUrl; // Чистая ссылка без url, кавычек и скобок

        // Перебор псевдомассива элементов с фоновыми картинками
        for (let i = 0; i < bgImages.length; i++) {
        	// Формирование списка текущих ссылок на картинки для IE и остальных браузеров
            imageList = bgImages[i].currentStyle || window.getComputedStyle(bgImages[i], false);
            // Выбор текущей ссылки на картинку из списка
            currentImage = imageList.backgroundImage;
            // Вырезание лишних символов и получение чистой ссылки
            pureUrl = currentImage.replace(/"/g, '').replace(/\(/g, '').replace(/\)/g, '')
                                  .replace(/url/g, '');

                // Определение ссылок на картинки формата webP для обычных экранов
                if (testWebP && pixelRatio === 1) { 
                   newURL = pureUrl.replace(/@1x.jpg/g, urlWebp1x);
                // Определение ссылок на картинки формата webP для экранов с разрешением более 1.5 DPI
                } else if (testWebP && pixelRatio > 1.5) {
                   newURL = pureUrl.replace(/@1x.jpg/g, urlWebp2x);
                // Определение ссылок на картинки формата jpg для экранов с разрешением более 1.5 DPI
                } else if (!testWebP && pixelRatio > 1.5) {
                   newURL = pureUrl.replace(/@1x.jpg/g, urlJpg2x);
                // Определение ссылок на картинки формата jpg для обычных экранов
                } else if (!testWebP && pixelRatio === 1){
                   newURL = pureUrl.replace(/@1x.jpg/g, prevUrlEnd);
                }
        
            bgImages[i].style.backgroundImage = `url(${newURL})`; // Установка новых ссылок
        }
    }
    imageTypeChange(bgImgOpt.images, bgImgOpt.urlWebp1x, bgImgOpt.urlWebp2x, 
    	           bgImgOpt.urlJpg2x, bgImgOpt.prevUrlEnd);

})();