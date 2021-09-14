/**
 * Creates a initial menu for electron apps
 *
 * @returns {Object}  a menu object to be passed to electron.Menu
 */

module.exports = function () {
  const template = [
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: (function () {
            if (process.platform === 'darwin') return 'Ctrl+Command+F';
            return 'F11';
          }()),
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          },
        },
      ],
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize',
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close',
        },
      ],
    },
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: 'Media Tagger',
    });
  }

  return template;
};
