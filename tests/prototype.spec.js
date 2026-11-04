import {readFileSync} from 'node:fs';
import {test,expect} from '@playwright/test';
import {modules,schedule,allLessons} from '../src/data.js';
test('estrutura oficial: cinco módulos, seis treinos e calendário sem frequência inventada',()=>{
 expect(modules).toHaveLength(5);expect(allLessons.filter(l=>l.workout)).toHaveLength(6);
 for(const m of modules.slice(2))expect(m.lessons.filter(l=>l.workout)).toHaveLength(2);
 expect(schedule).toHaveLength(21);expect(schedule.every(d=>d.workoutId===null)).toBeTruthy();
 expect(schedule[20].closing).toBeTruthy();
});
test('conclusão, reversão, persistência e próxima aula pendente',async({page})=>{
 await page.goto('/area-de-membros');
 await expect(page.getByRole('heading',{name:'Bem-vinda ao seu desafio.'})).toBeVisible();
 await expect(page.locator('.sidebar-progress')).toContainText('0%');
 await page.getByRole('button',{name:'Começar pelo módulo inicial'}).click();
 await expect(page.getByRole('heading',{name:'Boas-vindas do Gabriel',exact:true})).toBeVisible();
 await expect(page.getByText('Vídeo será inserido',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Marcar como concluído'}).click();
 await page.reload();await expect(page.getByRole('button',{name:'Concluída · Desfazer'})).toBeVisible();
 await page.goto('/area-de-membros#home');await page.getByRole('button',{name:'Continuar de onde parei'}).click();
 await expect(page.getByRole('heading',{name:'Como funciona o desafio de 21 dias',exact:true})).toBeVisible();
 await page.goto('/area-de-membros#lesson/intro-1');await page.getByRole('button',{name:'Concluída · Desfazer'}).click();
 await page.reload();await expect(page.getByRole('button',{name:'Marcar como concluído'})).toBeVisible();
 await expect(page.locator('.sidebar-progress')).toContainText('0%');
});
test('calendário, treino e encerramento',async({page})=>{
 await page.goto('/area-de-membros#calendar');
 await page.getByRole('button',{name:'Dia 8, Acelerar',exact:true}).click();
 await expect(page.locator('.day-detail')).toContainText('Intermediário');
 await expect(page.locator('.day-actions button')).toHaveCount(2);
 await page.getByRole('button',{name:'Treino 03 — Acelerar A',exact:true}).click();
 await expect(page.getByText('40s / 20s',{exact:true})).toBeVisible();
 await expect(page.locator('.exercise-list>div')).toHaveCount(5);
 await expect(page.getByText('15 minutos',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Marcar como concluído'}).click();await page.reload();
 await expect(page.locator('.sidebar-progress')).toContainText('1 de 14 aulas');
 await page.goto('/area-de-membros#calendar');
 await page.getByRole('button',{name:'Dia 21, Evoluir',exact:true}).click();
 await expect(page.locator('.day-actions button')).toHaveCount(3);
 await expect(page.locator('.day-detail')).toContainText('Encerramento');
});
test('filtros, ficha de receita e arquivos ausentes',async({page})=>{
 await page.goto('/area-de-membros#food');
 await expect(page.locator('.recipe-card')).toHaveCount(5);
 await page.getByLabel('Refeição',{exact:true}).selectOption('Almoço');
 await page.getByLabel('Modo de preparo',{exact:true}).selectOption('Air fryer');
 await expect(page.locator('.recipe-card')).toHaveCount(1);
 await page.getByRole('button',{name:/Legumes na air fryer/}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 for(const title of ['Ingredientes e quantidades','Passo a passo','Utensílios','Temperatura','Substituições','Sugestão de acompanhamento','Conservação','Alergênicos'])await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Fechar receita'}).click();await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.getByLabel('Modo de preparo',{exact:true}).selectOption('Forno');
 await expect(page.getByText('Nenhuma receita com esses filtros')).toBeVisible();
 await page.getByRole('button',{name:'Limpar filtros'}).click();await expect(page.locator('.recipe-card')).toHaveCount(5);
 await expect(page.locator('.material')).toHaveCount(5);await expect(page.getByText('Material em preparação',{exact:true})).toHaveCount(5);
});
test('navegação e layout sem cortes',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/area-de-membros');
 if(testInfo.project.name==='mobile'){
  await page.getByRole('button',{name:'Abrir menu'}).click();await expect(page.locator('.sidebar')).toHaveClass(/open/);
  await page.getByRole('button',{name:'Meus módulos',exact:true}).click();await expect(page.locator('.sidebar')).not.toHaveClass(/open/);
 }else await page.getByRole('button',{name:'Meus módulos',exact:true}).click();
 await expect(page.locator('.module-card')).toHaveCount(5);
 await expect(page.getByText('Não incluído no acesso demonstrativo',{exact:true})).toHaveCount(2);
 for(const route of ['home','modules','calendar','food','module/1','module/5','lesson/workout-6']){
  await page.goto(`/area-de-membros#${route}`);
  await expect(page.locator('main')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 }
 await page.goto('/area-de-membros');await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:`artifacts/${testInfo.project.name}.png`,fullPage:true});
 expect(errors).toEqual([]);
});
test('prévia HTML independente abre e navega sem rede',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route(/^https?:\/\//,route=>route.request().isNavigationRequest()?route.fulfill({contentType:'text/html',body:readFileSync('artifacts/15m36-prototipo.html','utf8')}):route.abort());
 await page.goto('http://preview.test/');
 await expect(page.getByRole('heading',{name:'Bem-vinda ao seu desafio.'})).toBeVisible();
 await page.getByRole('button',{name:'Começar pelo módulo inicial'}).click();
 await expect(page.getByRole('heading',{name:'Boas-vindas do Gabriel',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Marcar como concluído'}).click();
 await expect(page.getByRole('button',{name:'Concluída · Desfazer'})).toBeVisible();
 expect(errors).toEqual([]);
});
