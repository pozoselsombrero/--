document.addEventListener('DOMContentLoaded', () => {

    const PURCHASE_LINK = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BTZ2HCXS3AZ2Q';
    const WHATSAPP_NUMBER = '584243493080';
    const WHATSAPP_MESSAGE = '¡Hola! Estoy interesado/a en comprar el Kit del Fabricante Inteligente, pero no está mi método de pago ¿Me ayudas para finalizar la compra? ¡Gracias!';

    const videoPlayer = document.getElementById('videoPlayer');
    const videoPlaceholder = document.getElementById('video-placeholder');
    const videoWrapper = document.getElementById('video-wrapper');
    const controlsContainer = document.getElementById('controls');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const timeline = document.getElementById('timeline');
    const progressBar = document.getElementById('progress-bar');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeIcon = document.getElementById('volume-icon');
    
    const scarcityModal = document.getElementById('scarcity-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const closeXBtn = document.getElementById('close-x-btn');
    const claimBtn = document.getElementById('claim-offer-btn');
    
    const buyNowBtn = document.getElementById('buy-now-btn');
    const purchaseOptionsModal = document.getElementById('purchase-options-modal');
    const closePurchaseXBtn = document.getElementById('close-purchase-x-btn');
    const whatsappLink = document.getElementById('whatsapp-link');
    const paypalLink = document.getElementById('paypal-link');
    
    const datetimeElement = document.getElementById('current-datetime');
    const localStorageKey = 'scarcityModalShown';

    let controlsTimeout = null;

    paypalLink.href = PURCHASE_LINK;
    
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;


    controlsContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    function hideControls() {
        if (!videoPlayer.paused) {
            controlsContainer.classList.add('controls-hidden');
        }
    }

    function showControls() {
        controlsContainer.classList.remove('controls-hidden');
        clearTimeout(controlsTimeout);
        if (!videoPlayer.paused && videoPlayer.style.display !== 'none') {
            controlsTimeout = setTimeout(hideControls, 3000);
        }
    }
    
    videoWrapper.addEventListener('mousemove', showControls);
    videoWrapper.addEventListener('touchstart', showControls);
    
    controlsContainer.addEventListener('mouseenter', () => clearTimeout(controlsTimeout));
    controlsContainer.addEventListener('mouseleave', showControls);

    function togglePlayPause() {
        if (videoPlayer.paused || videoPlayer.ended) {
            videoPlayer.play();
        } else {
            videoPlayer.pause();
        }
    }

    videoPlayer.addEventListener('loadedmetadata', () => {
        videoPlayer.volume = volumeSlider.value;
    });

    videoPlayer.addEventListener('play', () => {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        videoWrapper.classList.add('playing');
        showControls();
    });

    videoPlayer.addEventListener('pause', () => {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        videoWrapper.classList.remove('playing');
        clearTimeout(controlsTimeout);
        showControls();
    });
    
    videoPlayer.addEventListener('ended', () => {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        videoWrapper.classList.remove('playing');
        clearTimeout(controlsTimeout);
        showControls();
    });

    videoPlayer.addEventListener('timeupdate', () => {
        const currentTime = videoPlayer.currentTime;
        const duration = videoPlayer.duration;

        if (!isNaN(duration)) {
            const progress = (currentTime / duration) * 100;
            progressBar.style.width = `${progress}%`;
        }
    });

    playPauseBtn.addEventListener('click', togglePlayPause);

    timeline.addEventListener('click', (e) => {
        const timelineRect = timeline.getBoundingClientRect();
        const clickX = e.clientX - timelineRect.left;
        const percent = clickX / timelineRect.width;
        const seekTime = percent * videoPlayer.duration;

        if (!isNaN(videoPlayer.duration)) {
            videoPlayer.currentTime = seekTime;
        }
        showControls();
    });

    volumeSlider.addEventListener('input', () => {
        videoPlayer.volume = volumeSlider.value;
        volumeIcon.setAttribute('d',
            videoPlayer.volume === 0 ?
            'M12 4L8 8H4v8h4l4 4V4zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03zM18.88 5.62c.76.76 1.23 1.83 1.23 2.98 0 1.15-.47 2.22-1.23 2.98L17.46 12l1.42 1.42c.76.76 1.23 1.83 1.23 2.98 0 1.15-.47 2.22-1.23 2.98L18.88 17.62l1.42 1.42c.76-.76 1.23-1.83 1.23-2.98 0 1.15-.47 2.22-1.23-2.98L18.88 12l1.42-1.42c.76-.76 1.23-1.83 1.23-2.98 0 1.15-.47 2.22-1.23-2.98L18.88 5.62z'
            : 'M11 5L6 9H2v6h4l5 4V5zM19.07 15.07c.94-.94 1.53-2.24 1.53-3.57 0-1.33-.59-2.63-1.53-3.57L17.65 9.35c.57.57.92 1.34.92 2.3s-.35 1.73-.92 2.3l1.42 1.42zM15.5 12c0 .87-.36 1.68-.97 2.26L13.1 13.5c.38-.38.59-.88.59-1.5s-.21-1.12-.59-1.5l1.43-1.43c.61.58.97 1.39.97 2.26z'
        );
    });


    const startVideo = () => {
        if (videoPlaceholder.style.display !== 'none') {
            videoPlaceholder.style.opacity = '0';
            setTimeout(() => {
                videoPlaceholder.style.display = 'none';
                videoPlayer.style.display = 'block';
                videoPlayer.play();
            }, 500);
        } else if (videoPlayer.paused) {
            videoPlayer.play();
        }
    };

    const closeScarcityModal = (shouldStartVideo = false) => {
        scarcityModal.classList.add('hidden');
        

        if (shouldStartVideo) {
            startVideo();
        }
    };
    
    const showPurchaseOptionsModal = () => {
        purchaseOptionsModal.classList.remove('hidden');
    };
    
    const closePurchaseOptionsModal = () => {
        purchaseOptionsModal.classList.add('hidden');
        startVideo(); 
    };

    buyNowBtn.addEventListener('click', showPurchaseOptionsModal);
    
    closePurchaseXBtn.addEventListener('click', closePurchaseOptionsModal);
    purchaseOptionsModal.addEventListener('click', (e) => {
        if (e.target === purchaseOptionsModal) {
            closePurchaseOptionsModal();
        }
    });

    claimBtn.addEventListener('click', () => {
        closeScarcityModal(false); 
        showPurchaseOptionsModal(); 
        
        videoPlaceholder.style.opacity = '0';
        setTimeout(() => {
            videoPlaceholder.style.display = 'none';
            videoPlayer.style.display = 'block';
        }, 500);
    });

    videoWrapper.addEventListener('click', (e) => {
        if (videoPlaceholder.style.display !== 'none') {
            closeScarcityModal(true);
        }
    });
    
    closeBtn.addEventListener('click', () => closeScarcityModal(true));
    
    closeXBtn.addEventListener('click', () => closeScarcityModal(true));


    const showModal = () => {
        
            setTimeout(() => {
                scarcityModal.classList.remove('hidden');
            }, 500);
        
    };

    showModal();


    function updateDateTime() {
        const today = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };

        let formattedDate = today.toLocaleDateString('es-ES', options);

        if (datetimeElement) {
            formattedDate = formattedDate.replace(/(\s\d{1,2}\s)(.+?)(\s\d{4})/, '$1de $2$3');
            const finalDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
            
            datetimeElement.textContent = ` | ${finalDate}`;
        }
    }

    updateDateTime();
});