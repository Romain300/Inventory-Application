function openDialog(event) {
    const button = event.target;
    const idGame = button.dataset.idGame;
    const dialog = document.querySelector(`dialog[data-idGame="${idGame}"]`);
    dialog.showModal()
};

function closeDialog(event) {
    const button = event.target;
    const idGame = button.dataset.idGame;
    const dialog = document.querySelector(`dialog[data-idGame="${idGame}"]`);
    dialog.close();
}; 
