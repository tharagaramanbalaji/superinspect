class SuperInspectWidget {
  constructor(options = {}) {
    this.dashboardUrl = options.dashboardUrl || 'http://localhost:5173';
    this.isOpen = false;
    this.init();
  }

  init() {
    // 1. Create Container
    this.container = document.createElement('div');
    this.container.style.position = 'fixed';
    this.container.style.bottom = '24px';
    this.container.style.right = '24px';
    this.container.style.zIndex = '999999';
    this.container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    this.container.style.display = 'flex';
    this.container.style.flexDirection = 'column';
    this.container.style.alignItems = 'flex-end';

    // 2. Create the Iframe panel
    this.panel = document.createElement('iframe');
    this.panel.src = this.dashboardUrl;
    // Set responsive width/height maxing out at screen real estate
    this.panel.style.width = 'calc(100vw - 48px)';
    this.panel.style.maxWidth = '450px';
    this.panel.style.height = 'calc(100vh - 120px)';
    this.panel.style.maxHeight = '750px';
    
    this.panel.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    this.panel.style.borderRadius = '16px';
    this.panel.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 20px rgba(99, 102, 241, 0.1)';
    this.panel.style.display = 'none';
    this.panel.style.marginBottom = '16px';
    this.panel.style.backgroundColor = '#0f172a';
    
    // Animate smoothly
    this.panel.style.opacity = '0';
    this.panel.style.transform = 'translateY(20px) scale(0.95)';
    this.panel.style.transformOrigin = 'bottom right';
    this.panel.style.transition = 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)';

    // 3. Create Toggle Button
    this.button = document.createElement('button');
    // Using an SVG icon for a polished look
    this.button.innerHTML = `<svg xmlns="http://www.w3.org/-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
    
    this.button.style.width = '56px';
    this.button.style.height = '56px';
    this.button.style.borderRadius = '28px';
    this.button.style.border = 'none';
    this.button.style.backgroundColor = '#6366f1';
    this.button.style.color = '#ffffff';
    this.button.style.cursor = 'pointer';
    this.button.style.boxShadow = '0 4px 14px rgba(99, 102, 241, 0.4)';
    this.button.style.display = 'flex';
    this.button.style.alignItems = 'center';
    this.button.style.justifyContent = 'center';
    this.button.style.transition = 'all 0.2s ease-in-out';

    // Hover effects via JS for injection safety
    this.button.onmouseenter = () => {
        this.button.style.transform = 'scale(1.05)';
    };
    this.button.onmouseleave = () => {
        this.button.style.transform = 'scale(1)';
    };

    this.button.onclick = () => this.toggle();

    // 4. Append to DOM
    this.container.appendChild(this.panel);
    this.container.appendChild(this.button);
    document.body.appendChild(this.container);
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.panel.style.display = 'block';
      // Slight delay to allow display block to apply before animating opacity
      setTimeout(() => {
        this.panel.style.opacity = '1';
        this.panel.style.transform = 'translateY(0) scale(1)';
      }, 10);
      this.button.style.backgroundColor = '#334155'; // darker when open
      // switch to an 'X' icon when open
      this.button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
      this.panel.style.opacity = '0';
      this.panel.style.transform = 'translateY(20px) scale(0.95)';
      setTimeout(() => {
        if(!this.isOpen) this.panel.style.display = 'none';
      }, 250);
      this.button.style.backgroundColor = '#6366f1';
      this.button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
    }
  }
}

// Auto-initialize if running in browser script tag
if (typeof window !== 'undefined') {
  window.SuperInspectWidget = SuperInspectWidget;
}
