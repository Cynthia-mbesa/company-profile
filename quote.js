// Query DOM
const quoteForm = document.getElementById('quoteForm');
const checkboxes = Array.from(quoteForm.querySelectorAll('input[type="checkbox"]'));
const selectedServicesUL = document.getElementById('selectedServices');
const totalEl = document.getElementById('quoteTotal');
const emailBtn = document.getElementById('mailtoSend');
const copyBtn = document.getElementById('copyQuote');
const clientEmail = document.getElementById('clientEmail');
const clientName = document.getElementById('clientName');
const toast = document.getElementById('toast');

function formatKES(n){
  return n.toLocaleString('en-KE');
}

function refreshSummary(){
  selectedServicesUL.innerHTML = '';
  let total = 0;
  const chosen = checkboxes.filter(cb => cb.checked).map(cb => {
    const name = cb.dataset.name;
    const price = Number(cb.dataset.price || 0);
    total += price;
    return { name, price };
  });

  if (chosen.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No services selected.';
    selectedServicesUL.appendChild(li);
  } else {
    chosen.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} — KES ${formatKES(item.price)}`;
      selectedServicesUL.appendChild(li);
    });
  }

  totalEl.textContent = formatKES(total);
  return { chosen, total };
}

checkboxes.forEach(cb => cb.addEventListener('change', refreshSummary));
refreshSummary(); // initial

function showToast(msg, ms = 3000){
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  setTimeout(()=>{ toast.classList.remove('show'); toast.classList.add('hidden'); }, ms);
}

// Copy summary to clipboard
copyBtn.addEventListener('click', async () => {
  const { chosen, total } = refreshSummary();
  if (chosen.length === 0) { showToast('Select at least one service.'); return; }
  const lines = chosen.map(c => `${c.name} — KES ${formatKES(c.price)}`);
  lines.push('');
  lines.push(`Total: KES ${formatKES(total)}`);
  const text = `Quote request\n\n${lines.join('\n')}`;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Quote copied to clipboard.');
  } catch (e) {
    showToast('Could not copy to clipboard.');
  }
});

// Send via mailto: (fallback)
emailBtn.addEventListener('click', () => {
  const { chosen, total } = refreshSummary();
  if (chosen.length === 0) { showToast('Select at least one service before sending.'); return; }
  if (!clientEmail.value.trim()) { showToast('Please provide your email so we can reply.'); clientEmail.focus(); return; }

  const lines = chosen.map(c => `${c.name} — KES ${formatKES(c.price)}`);
  lines.push('');
  lines.push(`Total: KES ${formatKES(total)}`);
  lines.push('');
  const nameLine = clientName.value.trim() ? `Client: ${clientName.value.trim()}` : '';
  const bodyArray = ['Quote request from website', '', ...lines, nameLine, `Reply to: ${clientEmail.value.trim()}`];
  const subject = encodeURIComponent('Service Quote Request — Wangenja Edu-Consult');
  const body = encodeURIComponent(bodyArray.filter(Boolean).join('\n'));

  // open default mail client
  window.location.href = `mailto:youremail@domain.com?subject=${subject}&body=${body}`;
});

// accessibility: allow keyboard toggle of checkboxes area using space/enter on labels via native behavior
// no extra code needed for that; ensure labels wrap inputs in markup.