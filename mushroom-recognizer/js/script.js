$(() => {
    let canvas = $("#input-canvas");
    let ctx = canvas[0].getContext('2d');
    let loading = $("#loading");
    let img = new Image();
    let reader = new FileReader();

    $("#upload-image").on('change', (e) => {
        loading.addClass('active');
        let file = e.target.files[0];

        reader.readAsDataURL(file);
        reader.onload = (evt) => {
            if( evt.target.readyState == FileReader.DONE) {
                img.src = evt.target.result;
                img.onload = (e) => {
                    ctx.drawImage(img, 0, 0, 229, 229);
                    loading.removeClass('active');
                }
            }
        }
    })

    $("#predict").on('click', (e) => {
        newPredict();
    })
});