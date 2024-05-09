document.addEventListener('DOMContentLoaded', function () {
    const filterButton = document.getElementById('filter-button');
    const filterDialogue = document.getElementById('filter-dialogue');
    const overlay = document.getElementById('overlay');
    const closeButton = document.getElementById('close-filter');
  
    filterButton.addEventListener('click', function () {
      filterDialogue.style.display = 'block'; // Show the filter dialogue
      overlay.style.display='block';
    });
  
    closeButton.addEventListener('click', function () {
      filterDialogue.style.display = 'none'; // Hide the filter dialogue
      overlay.style.display = 'none';
    });
  });