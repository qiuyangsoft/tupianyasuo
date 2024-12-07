document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const downloadBtn = document.getElementById('downloadBtn');
    const compressionControls = document.querySelector('.compression-controls');
    const previewContainer = document.querySelector('.preview-container');

    let originalFile = null;

    // 上传区域点击事件
    dropZone.addEventListener('click', () => fileInput.click());

    // 文件拖拽事件
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007AFF';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#DEDEDE';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#DEDEDE';
        const files = e.dataTransfer.files;
        if (files.length) handleFile(files[0]);
    });

    // 文件选择事件
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    // 质量滑块事件
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (originalFile) compressImage(originalFile);
    });

    // 处理上传的文件
    function handleFile(file) {
        if (!file.type.match(/image\/(jpeg|png)/i)) {
            alert('请上传 PNG 或 JPG 格式的图片！');
            return;
        }

        originalFile = file;
        compressionControls.hidden = false;
        previewContainer.hidden = false;

        // 显示原始图片
        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            originalSize.textContent = formatFileSize(file.size);
            compressImage(file);
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                canvas.toBlob(
                    (blob) => {
                        compressedPreview.src = URL.createObjectURL(blob);
                        compressedSize.textContent = formatFileSize(blob.size);
                        
                        // 更新下载按钮
                        downloadBtn.onclick = () => {
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `compressed_${originalFile.name}`;
                            link.click();
                        };
                    },
                    'image/jpeg',
                    qualitySlider.value / 100
                );
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 