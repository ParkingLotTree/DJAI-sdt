// This is the file content.js

// 🚨 Define the unique link text that triggers the VIDEO embed.
const TARGET_VIDEO_TEXT = 'Click this text to watch the video demo'; 
const RAW_GITHUB_PREFIX = 'https://raw.githubusercontent.com/';

// -----------------------------------------------------------------------
// FUNCTION TO EMBED MEDIA
// -----------------------------------------------------------------------

function embedMedia(rootElement) {
    const selector = 'p a';

    rootElement.querySelectorAll(selector).forEach(linkElement => {
        const linkHref = linkElement.href;
        const linkText = linkElement.textContent.trim();
        const parentP = linkElement.closest('p');

        // Skip if already processed or no parent paragraph
        if (!parentP || parentP.hasAttribute('data-media-embedded')) {
            return;
        }

        let embedHtml = null;

        // --- AUDIO LOGIC (Keep this) ---
        if (linkText === 'Click this text to hear Xen Tveten first message audio' && linkHref.startsWith(RAW_GITHUB_PREFIX) && linkHref.endsWith('.mp3')) {
             embedHtml = `
                <span class="custom-audio-embed">
                    <audio controls preload="none" src="${linkHref}">
                        Your browser does not support the audio element.
                    </audio>
                </span>
            `;
        } 
        
        // --- VIDEO LOGIC (New) ---
        else if (linkText === TARGET_VIDEO_TEXT && linkHref.startsWith(RAW_GITHUB_PREFIX) && linkHref.endsWith('.mp4')) {
             embedHtml = `
                <span class="custom-video-embed">
                    <video controls preload="metadata" src="${linkHref}" style="max-width: 100%; height: auto;">
                        Your browser does not support the video element.
                    </video>
                </span>
            `;
        }


        // --- Apply the embed if one was created ---
        if (embedHtml) {
            parentP.innerHTML = embedHtml;
            // Use a generic attribute for both audio/video to mark the paragraph
            parentP.setAttribute('data-media-embedded', 'true'); 
        }
    });
}

// -----------------------------------------------------------------------
// MutationObserver setup
// -----------------------------------------------------------------------

const config = { childList: true, subtree: true };

const callback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { 
                    embedMedia(node);
                }
            });
        }
    }
};

const observer = new MutationObserver(callback);
observer.observe(document.body, config);

// Initial check
embedMedia(document);