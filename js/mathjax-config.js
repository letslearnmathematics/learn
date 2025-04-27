/**
 * MathJax Configuration File
 * Moves all MathJax configuration from HTML to this external JS file
 * Includes dynamic loading and typesetting functions
 */

// =============================================
// MATHJAX CONFIGURATION
// =============================================
window.MathJax = {
    // TeX input configuration
    tex: {
      inlineMath: [['\\(', '\\)']],        // Inline math delimiters
      displayMath: [['\\[', '\\]']],       // Display math delimiters
      processEscapes: true,                // Allow \$ for dollar signs
      packages: {'[+]': ['ams']},          // Additional packages
      tags: 'ams',                         // AMS numbering style
      tagSide: 'right',                    // Equation numbering on right
      tagIndent: '0.8em',                  // Indentation for tags
      useLabelIds: true,                   // Use label ids for references
      multlineWidth: '85%',                // Width for multline environments
      autoload: {                          // Automatic loading of extensions
        color: [],
        colorV2: ['color']
      },
      macros: {                            // Custom macros
        RR: '\\mathbb{R}',
        bold: ['\\boldsymbol{#1}', 1]
      }
    },
  
    // Output options
    chtml: {
      scale: 0.9,                          // Scale down on mobile
      mtextInheritFont: true,              // Inherit font for text
      merrorInheritFont: true,             // Inherit font for errors
      mathmlSpacing: true,                 // MathML spacing rules
      skipAttributes: {},                  // Attributes to skip
      exFactor: 0.5,                       // Scaling factor for ex units
      displayAlign: 'center',              // Display alignment
      displayIndent: '0'                   // Display indent
    },
  
    // General options
    options: {
      ignoreHtmlClass: 'tex2jax_ignore',   // Class to ignore processing
      processHtmlClass: 'tex2jax_process', // Class to force processing
      renderActions: {
        findScript: [10, function (doc) {
          document.querySelectorAll('script[type^="math/tex"]').forEach(
            function(node) {
              const display = !!node.type.match(/; *mode=display/);
              const math = new doc.options.MathItem(
                node.textContent, doc.inputJax[0], display);
              const text = document.createTextNode('');
              node.parentNode.replaceChild(text, node);
              math.start = {node: text, delim: '', n: 0};
              math.end = {node: text, delim: '', n: 0};
              doc.math.push(math);
            }
          );
        }, '']
      }
    },
  
    // Startup configuration
    startup: {
      ready: () => {
        console.log('MathJax is ready!');
        MathJax.startup.defaultReady();
        
        // Process dynamic content
        MathJax.startup.promise.then(() => {
          console.log('MathJax initialized, ready for dynamic content');
          
          // Typeset the initial page
          MathJax.typesetPromise().catch(err => {
            console.error('Initial typeset failed:', err);
          });
          
          // Set up mutation observer for dynamic content
          if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
              let needsUpdate = false;
              for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                  if (node.nodeType === 1 && 
                      (node.classList.contains('tex2jax_process') || 
                      node.querySelector('.tex2jax_process'))) {
                    needsUpdate = true;
                  }
                }
              }
              if (needsUpdate) {
                MathJax.typesetPromise().catch(err => {
                  console.error('Dynamic typeset failed:', err);
                });
              }
            });
            
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
          }
        });
      }
    }
  };
  
  // =============================================
  // MATHJAX LOADING SYSTEM
  // =============================================
  
  // Load Polyfill first (required for some browsers)
  function loadMathJaxPolyfill() {
    return new Promise((resolve) => {
      if (window.MathJax) {
        resolve();
        return;
      }
  
      const polyfill = document.createElement('script');
      polyfill.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
      polyfill.onload = resolve;
      polyfill.onerror = () => {
        console.warn('MathJax polyfill failed to load, proceeding anyway');
        resolve();
      };
      document.head.appendChild(polyfill);
    });
  }
  
  // Main MathJax loading function
  function loadMathJax() {
    return new Promise((resolve, reject) => {
      if (document.getElementById('MathJax-script')) {
        resolve();
        return;
      }
  
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
      script.async = true;
      script.id = 'MathJax-script';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  // Typeset function for manual control
  window.typesetMath = function() {
    if (window.MathJax && window.MathJax.typesetPromise) {
      return MathJax.typesetPromise();
    }
    return Promise.reject('MathJax not loaded');
  };
  
  // Initialize MathJax when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    loadMathJaxPolyfill()
      .then(loadMathJax)
      .then(() => {
        console.log('MathJax loaded successfully');
      })
      .catch(err => {
        console.error('MathJax loading failed:', err);
      });
  });
  
  // Export for module systems (if needed)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      MathJaxConfig: window.MathJax,
      loadMathJax,
      typesetMath
    };
  }