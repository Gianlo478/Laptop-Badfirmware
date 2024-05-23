document.addEventListener('DOMContentLoaded', (event) => {
    const introScreen = document.getElementById('intro-screen');
    const playButton = document.getElementById('play-button');
    const video = document.getElementById('background-video');
    const audio = document.getElementById('background-audio');
    const videoBackground = document.querySelector('.video-background');
    const overlayTextPart1 = document.getElementById('part1');
    const overlayTextPart2 = document.getElementById('part2');
    const overlayTextPart3 = document.getElementById('part3');
    const mapContainer = document.getElementById('map-container');
    const mapIframe = document.getElementById('map-iframe');
    let infoIndex = 0;
    let interval;

    // Función para obtener datos de la API de ipapi.co
    async function fetchIPInfo() {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return data;
    }

    // Función para obtener la moneda del país usando la API de restcountries.com
    async function getCurrency(countryCode) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
            const data = await response.json();
            return data[0].currencies ? Object.keys(data[0].currencies)[0] : 'USD';
        } catch (error) {
            console.error('Error al obtener la moneda:', error);
            return 'USD';
        }
    }

    // Función para obtener el nivel de batería
    async function getBatteryLevel() {
        if (navigator.getBattery) {
            const battery = await navigator.getBattery();
            return `${Math.round(battery.level * 100)}%`;
        }
        return '100%';
    }

    // Función actualizada para iniciar la pantalla
    async function startIntro() {
        try {
            const ipInfo = await fetchIPInfo();
            const currency = await getCurrency(ipInfo.country_code);
            const batteryLevel = await getBatteryLevel();

            playButton.addEventListener('click', () => {
                audio.play().then(() => {
                    introScreen.style.display = 'none';
                    videoBackground.style.display = 'block';
                    overlayTextPart1.style.display = 'block';
                    overlayTextPart2.style.display = 'none';
                    overlayTextPart3.style.display = 'none';
                    mapContainer.style.display = 'none';

                    video.play().then(() => {
                        overlayTextPart1.classList.add('fade-in-out');

                        // Ocultar part1 y mostrar part2 después de la animación
                        setTimeout(() => {
                            overlayTextPart1.style.display = 'none';
                            overlayTextPart2.style.display = 'flex';
                        }, 4000); // 4000 milisegundos = 4 segundos

                        // Mostrar la información después de 4.5 segundos
                        setTimeout(() => startShowingInfo(ipInfo), 4500); // 4500 milisegundos = 4.5 segundos

                        // Limpiar la pantalla de información en el segundo 10
                        setTimeout(clearInfo, 10000); // 10000 milisegundos = 10 segundos

                        // Mostrar part3 después de 18 segundos
                        setTimeout(() => {
                            overlayTextPart2.style.display = 'none';
                            overlayTextPart3.style.display = 'flex';
                            startShowingInfoPart3(ipInfo, currency, batteryLevel);
                        }, 18750); // 18750 milisegundos = 18.75 segundos

                        // Limpiar la pantalla en el segundo 24
                        setTimeout(() => {
                            overlayTextPart3.style.display = 'none';
                            clearInfo();

                            // Mostrar el mapa al final sin retraso
                            const loc = ipInfo.latitude + ',' + ipInfo.longitude;
                            const mapUrl = `https://maps.google.com/maps?q=${loc}&z=15&output=embed`;
                            mapIframe.src = mapUrl;
                            mapContainer.style.display = 'block';

                            // Limpiar el mapa 2 segundos después de mostrarlo
                            setTimeout(() => {
                                mapContainer.style.display = 'none';
                                // Recargar la página después de limpiar el mapa
                                window.location.reload();
                            }, 2000); // 2000 milisegundos = 2 segundos
                        }, 27300); // 27500 milisegundos = 27.5 segundos
                    }).catch(error => {
                        console.error('Error al reproducir el video:', error);
                    });
                }).catch(error => {
                    console.error('Error al reproducir el audio:', error);
                });
            });
        } catch (error) {
            console.error('Error al obtener información de IP:', error);
        }
    }

    function startShowingInfo(ipInfo) {
        const infoElements = [
            { id: 'info1', text: `IP: ${ipInfo.ip}` },
            { id: 'info2', text: `ISP: ${ipInfo.org}` },
            { id: 'info3', text: `ORG: ${ipInfo.org}` },
            { id: 'info4', text: `Ciudad: ${ipInfo.city}` },
            { id: 'info5', text: `Región: ${ipInfo.region}` },
            { id: 'info6', text: `User Agent: ${navigator.userAgent}` },
            { id: 'info7', text: `Cookies Enabled: ${navigator.cookieEnabled}` },
        ];

        // Mostrar el primer elemento inmediatamente
        document.getElementById(infoElements[0].id).innerText = infoElements[0].text;

        // Mostrar los siguientes elementos después del primer elemento con un retraso de 0.635 segundos
        interval = setInterval(() => {
            infoIndex++;
            if (infoIndex >= infoElements.length) {
                clearInterval(interval);
                return;
            }
            const element = infoElements[infoIndex];
            document.getElementById(element.id).innerText = element.text;
        }, 635); // 635 milisegundos
    }

    function startShowingInfoPart3(ipInfo, currency, batteryLevel) {
        const infoElementsPart3 = [
            { id: 'info8', text: `Country: ${ipInfo.country_name}` },
            { id: 'info9', text: `Region: ${ipInfo.region}` },
            { id: 'info10', text: `City: ${ipInfo.city}` },
            { id: 'info11', text: `Zip Code: ${ipInfo.postal_code}` },
            { id: 'info12', text: `Lat: ${ipInfo.latitude}` },
            { id: 'info13', text: `Lon: ${ipInfo.longitude}` },
            { id: 'info14', text: `Timezone: ${ipInfo.timezone}` },
            { id: 'info15', text: `Local Time: ${new Date().toLocaleTimeString()}` },
            { id: 'info16', text: `Currency: ${currency}` },
            { id: 'info17', text: `Language Headers: ${navigator.language}` },
            { id: 'info18', text: `Enable Languages: ${navigator.languages.join(', ')}` },
            { id: 'info19', text: `Autonomous System: ${ipInfo.asn}` },
            { id: 'info20', text: `OS: ${navigator.platform}` },
            { id: 'info21', text: `CPU Threads: ${navigator.hardwareConcurrency}` },
            { id: 'info22', text: `Memory: ${navigator.deviceMemory} GB` },
            { id: 'info23', text: `Heap Size Limit: ${performance.memory.jsHeapSizeLimit}` },
            { id: 'info24', text: `GPU Vendor: ${getGPUMetadata().vendor}` },
            { id: 'info25', text: `GPU Info: ${getGPUMetadata().renderer}` },
            { id: 'info26', text: `Mobile: ${navigator.userAgentData.mobile}` },
            { id: 'info27', text: `Touch Enable: ${'ontouchstart' in window}` },
            { id: 'info28', text: `Battery: ${batteryLevel}` },
            { id: 'info29', text: 'Trolled: true' },
        ];

        // Mostrar los elementos de información en pares cada 1 segundo
        let part3Index = 0;
        interval = setInterval(() => {
            if (part3Index >= infoElementsPart3.length) {
                clearInterval(interval);
                return;
            }

            document.getElementById(infoElementsPart3[part3Index].id).innerText = infoElementsPart3[part3Index].text;
            if (part3Index + 1 < infoElementsPart3.length) {
                document.getElementById(infoElementsPart3[part3Index + 1].id).innerText = infoElementsPart3[part3Index + 1].text;
            }
            part3Index += 2;
        }, 650); // 650 milisegundos
    }

    function clearInfo() {
        const infoElements = document.querySelectorAll('.info-text');
        infoElements.forEach(element => {
            element.innerText = '';
        });
    }

    function getGPUMetadata() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            return { vendor: 'Unknown', renderer: 'Unknown' };
        }
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
        };
    }

    // Iniciar la pantalla de introducción
    startIntro();
});
