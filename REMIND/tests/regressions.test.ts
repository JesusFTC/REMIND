import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDate, requireDate, localDateInput } from '../src/utils/date.ts';
import { toRow, fromRow } from '../src/services/supabase/reminderMapping.ts';
import { migrateReminders } from '../src/utils/migrateReminders.ts';
import type { Reminder } from '../src/types/index.ts';
const reminder = (id='local-1'): Reminder => ({ id, userId:'', title:'Comprar', dueDate:new Date('2026-10-26T20:30:00-06:00'), category:'Casa', priority:'high', status:'pending', repeat:'weekly', createdAt:new Date(), updatedAt:new Date() });
test('normaliza Date, ISO y epoch sin alterar el instante',()=>{
  for(const value of [new Date(0),'1970-01-01T00:00:00Z',0]) assert.equal(requireDate(value).getTime(),0);
});
test('rechaza valores ausentes y fechas inválidas',()=>{
  for(const value of [null,undefined,'',false,{},'incorrecto',new Date(NaN)]) {
    assert.equal(normalizeDate(value),null); assert.throws(()=>requireDate(value));
  }
});
test('mapea explícitamente columnas y omite IDs del cliente',()=>{
  const row=toRow({...reminder(),userId:'suplantado'});
  assert.equal(row.due_date,'2026-10-27T02:30:00.000Z');
  assert.equal(row.repeat_interval,'weekly'); assert.equal(row.category_name,'Casa');
  for(const key of ['id','userId','user_id','createdAt','dueDate']) assert.equal(key in row,false);
});
test('actualizaciones parciales no borran otros campos',()=>assert.deepEqual(toRow({status:'completed'}),{status:'completed'}));
test('no guarda títulos vacíos o fechas inválidas',()=>{
  assert.throws(()=>toRow({title:'  '})); assert.throws(()=>toRow({dueDate:'bad' as unknown as Date}));
});
test('lectura remota devuelve fechas Date utilizables por las tarjetas',()=>{
  const row=fromRow({id:'r',user_id:'u',title:'Test',description:null,due_date:'2026-10-27T02:30:00Z',category_name:null,priority:'low',status:'pending',repeat_interval:'none',created_at:null,updated_at:null});
  assert.ok(row.dueDate instanceof Date); assert.equal(row.userId,'u'); assert.equal(row.category,'General');
});
test('fecha del formulario usa día local incluso cuando UTC ya es mañana',()=>{
  const date=new Date(2026,9,26,23,30);
  assert.equal(localDateInput(date),'2026-10-26');
});
test('importa fechas serializadas y confirma solo después del guardado',async()=>{
  const events:string[]=[];
  const item={...reminder(),dueDate:'2026-10-27T02:30:00Z' as unknown as Date};
  assert.deepEqual(await migrateReminders([item],'u',async r=>{assert.ok(r.dueDate instanceof Date);events.push('save');},()=>events.push('ack')),[]);
  assert.deepEqual(events,['save','ack']);
});
test('conserva fallos de red y fechas inválidas, continúa con los válidos',async()=>{
  const ack:string[]=[];
  const items=[{...reminder('bad-date'),dueDate:'bad' as unknown as Date},reminder('network'),reminder('ok')];
  const errors=await migrateReminders(items,'u',async r=>{if(r.id==='network') throw Error('403');},id=>ack.push(id));
  assert.deepEqual(errors,['bad-date','network']); assert.deepEqual(ack,['ok']);
});
test('no importa recordatorios que pertenecen a otra cuenta',async()=>{
  let calls=0;
  await migrateReminders([{...reminder(),userId:'other'}],'u',async()=>{calls++;},()=>{calls++;});
  assert.equal(calls,0);
});
