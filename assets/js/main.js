function el(id){return document.getElementById(id)}

document.addEventListener('DOMContentLoaded',function(){
  const y=new Date().getFullYear();
  if(el('year')) el('year').textContent=y;
  if(el('year-2')) el('year-2').textContent=y;
});

function handleNotify(e){
  e.preventDefault();
  const email = el('email').value.trim();
  if(!email) return false;
  // open mail client as a quick waitlist signup fallback
  const subject = encodeURIComponent('Waitlist signup — BazarSide');
  const body = encodeURIComponent('Please add me to the waitlist: ' + email);
  window.location.href = `mailto:info.bazarside@gmail.com?subject=${subject}&body=${body}`;
  return false;
}

function handleContact(e){
  e.preventDefault();
  const name = el('name').value.trim();
  const email = el('cemail').value.trim();
  const msg = el('message').value.trim();
  if(!name||!email||!msg) return false;
  const subject = encodeURIComponent('Website contact from ' + name);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
  const mailto = `mailto:info.bazarside@gmail.com?subject=${subject}&body=${body}`;
  // open mail client, and show a friendly message
  window.location.href = mailto;
  const r = el('contact-result');
  if(r) r.textContent = 'Opening your email client...';
  return false;
}
