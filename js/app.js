function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
}

function closeMobileMenu() {
  document.querySelectorAll('.mobile-menu').forEach((m) => m.classList.remove('open'));
}
