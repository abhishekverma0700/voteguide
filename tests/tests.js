document.addEventListener('DOMContentLoaded', () => {
  const results = [];
  function assert(condition, message){ if(!condition) throw new Error(message); }
  function test(name, fn){ try{ fn(); console.log(`PASS: ${name}`); results.push({name,ok:true}); } catch(e){ console.error(`FAIL: ${name}`); console.error(e); results.push({name,ok:false,err:e}); } }

  // helpers
  const FALLBACK_REPLY = "That's a great question — in many places the election office website has official guidance. Try a different phrasing or use a quick question.";

  test('botResponses object exists', ()=>{
    assert(typeof botResponses === 'object', 'botResponses should be an object');
    assert(Object.keys(botResponses).length >= 10, 'Expect at least 10 preloaded responses');
  });

  test('getBotReply exact match returns helpful answer', ()=>{
    const reply = getBotReply('How do I register to vote?');
    assert(typeof reply === 'string' && reply.length > 10, 'Reply should be a non-empty string');
    assert(reply.toLowerCase().includes('register') || reply !== FALLBACK_REPLY, 'Reply should address registration');
  });

  test('getBotReply fuzzy match for keyword', ()=>{
    const reply = getBotReply('register');
    assert(typeof reply === 'string', 'Reply should be string');
    assert(reply !== FALLBACK_REPLY, 'Fuzzy match should not return fallback');
  });

  test('eligibility checker: age >=18 & citizen=yes is eligible', ()=>{
    const age = document.querySelector('#age');
    const cit = document.querySelector('#citizenship');
    const out = document.querySelector('#eligibility-result');
    age.value = '20';
    cit.value = 'yes';
    age.dispatchEvent(new Event('input',{bubbles:true}));
    cit.dispatchEvent(new Event('change',{bubbles:true}));
    // allow any handlers to run
    assert(out.textContent.toLowerCase().includes('eligible'), 'Expected eligible message');
    assert(out.classList.contains('ok'), 'Expected .ok class on eligible');
  });

  test('eligibility checker: age <18 is not eligible', ()=>{
    const age = document.querySelector('#age');
    const cit = document.querySelector('#citizenship');
    const out = document.querySelector('#eligibility-result');
    age.value = '16';
    cit.value = 'yes';
    age.dispatchEvent(new Event('input',{bubbles:true}));
    cit.dispatchEvent(new Event('change',{bubbles:true}));
    assert(out.textContent.toLowerCase().includes('not eligible') || out.classList.contains('no'), 'Expected not eligible message or .no class');
  });

  test('glossary search filters terms (EVM)', ()=>{
    const input = document.querySelector('#glossary-search');
    const list = document.querySelector('#glossary-list');
    input.value = 'EVM';
    input.dispatchEvent(new Event('input',{bubbles:true}));
    const items = Array.from(list.querySelectorAll('.glossary-item'));
    assert(items.length >= 1, 'Expected at least one glossary item for EVM');
    assert(items[0].textContent.toLowerCase().includes('evm'), 'First item should mention EVM');
  });

  // Summary
  const passed = results.filter(r=>r.ok).length;
  const failed = results.length - passed;
  console.log(`\nTest summary: ${passed} passed, ${failed} failed (${results.length} total)`);
});
