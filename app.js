const form = document.getElementById('directorioForm');
    const aliasesList = document.getElementById('aliasesList');
    const contactosList = document.getElementById('contactosList');
    const direccionesList = document.getElementById('direccionesList');
    const statusBox = document.getElementById('statusBox');
const API_ENDPOINT = 'https://n8n.bforward.cloud/webhook/0fff060f-8102-4a78-b520-53f212e354da';
const API_METHOD = 'POST';

    function showStatus(type, message) {
      statusBox.className = `status-box show ${type}`;
      statusBox.textContent = message;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function clearStatus() {
      statusBox.className = 'status-box';
      statusBox.textContent = '';
    }

    function cleanValue(value) {
      if (typeof value !== 'string') return value;
      const v = value.trim();
      return v === '' ? null : v;
    }

    function aliasTemplate(index, data = {}) {
      return `
        <div class="repeat-item" data-type="alias">
          <div class="repeat-item-header">
            <div class="repeat-item-title">Alias #${index + 1}</div>
            <button type="button" class="btn btn-danger" onclick="removeItem(this)">Eliminar</button>
          </div>
          <div class="grid">
            <div class="col-8">
              <label>Alias / nombre alterno</label>
              <input type="text" data-field="alias_nombre" value="${escapeHtml(data.alias_nombre || '')}" placeholder="Ej. BAJA FORWARDING / BFORWARD / BL NAME" />
            </div>
            <div class="col-4">
              <label>Tipo alias</label>
              <select data-field="alias_tipo">
                <option value="operativo" ${data.alias_tipo === 'operativo' ? 'selected' : ''}>Operativo</option>
                <option value="legal" ${data.alias_tipo === 'legal' ? 'selected' : ''}>Legal</option>
                <option value="billing" ${data.alias_tipo === 'billing' ? 'selected' : ''}>Billing</option>
                <option value="documental" ${data.alias_tipo === 'documental' ? 'selected' : ''}>Documental</option>
                <option value="bl_name" ${data.alias_tipo === 'bl_name' ? 'selected' : ''}>BL Name</option>
                <option value="otro" ${data.alias_tipo === 'otro' ? 'selected' : ''}>Otro</option>
              </select>
            </div>
            <div class="col-12">
              <label>Notas</label>
              <input type="text" data-field="notas" value="${escapeHtml(data.notas || '')}" placeholder="Observación opcional" />
            </div>
          </div>
        </div>
      `;
    }

    function contactoTemplate(index, data = {}) {
      return `
        <div class="repeat-item" data-type="contacto">
          <div class="repeat-item-header">
            <div class="repeat-item-title">Contacto #${index + 1}</div>
            <button type="button" class="btn btn-danger" onclick="removeItem(this)">Eliminar</button>
          </div>
          <div class="grid">
            <div class="col-6">
              <label>Nombre completo</label>
              <input type="text" data-field="nombre_completo" value="${escapeHtml(data.nombre_completo || '')}" placeholder="Nombre y apellido" />
            </div>
            <div class="col-3">
              <label>Puesto</label>
              <input type="text" data-field="puesto" value="${escapeHtml(data.puesto || '')}" placeholder="Ej. Pricing Manager" />
            </div>
            <div class="col-3">
              <label>Área</label>
              <input type="text" data-field="area" value="${escapeHtml(data.area || '')}" placeholder="Operaciones / Billing / Dirección" />
            </div>

            <div class="col-4">
              <label>Email</label>
              <input type="email" data-field="email" value="${escapeHtml(data.email || '')}" placeholder="correo@dominio.com" />
            </div>
            <div class="col-2">
              <label>Celular</label>
              <input type="text" data-field="telefono_celular" value="${escapeHtml(data.telefono_celular || '')}" placeholder="646..." />
            </div>
            <div class="col-2">
              <label>Oficina</label>
              <input type="text" data-field="telefono_oficina" value="${escapeHtml(data.telefono_oficina || '')}" placeholder="646..." />
            </div>
            <div class="col-2">
              <label>Extensión</label>
              <input type="text" data-field="extension" value="${escapeHtml(data.extension || '')}" placeholder="101" />
            </div>
            <div class="col-2">
              <label>WhatsApp</label>
              <input type="text" data-field="whatsapp" value="${escapeHtml(data.whatsapp || '')}" placeholder="646..." />
            </div>

            <div class="col-2">
              <label>Idioma</label>
              <select data-field="idioma">
                <option value="es" ${(data.idioma || 'es') === 'es' ? 'selected' : ''}>ES</option>
                <option value="en" ${data.idioma === 'en' ? 'selected' : ''}>EN</option>
              </select>
            </div>
            <div class="col-10">
              <label>Clasificación</label>
              <div class="check-grid">
                <label class="check-pill"><input type="checkbox" data-field="es_contacto_operativo" ${data.es_contacto_operativo ? 'checked' : ''} /> <span>Operativo</span></label>
                <label class="check-pill"><input type="checkbox" data-field="es_contacto_facturacion" ${data.es_contacto_facturacion ? 'checked' : ''} /> <span>Facturación</span></label>
                <label class="check-pill"><input type="checkbox" data-field="es_contacto_principal" ${data.es_contacto_principal ? 'checked' : ''} /> <span>Principal</span></label>
                <label class="check-pill"><input type="checkbox" data-field="recibe_notificaciones" ${data.recibe_notificaciones !== false ? 'checked' : ''} /> <span>Recibe notificaciones</span></label>
                <label class="check-pill"><input type="checkbox" data-field="activo" ${data.activo !== false ? 'checked' : ''} /> <span>Activo</span></label>
              </div>
            </div>
            <div class="col-12">
              <label>Notas contacto</label>
              <textarea data-field="notas_contacto" placeholder="Observaciones, horarios, canal preferido, etc.">${escapeHtml(data.notas_contacto || '')}</textarea>
            </div>
          </div>
        </div>
      `;
    }

    function direccionTemplate(index, data = {}) {
      const tipo = data.tipo_direccion || 'fiscal';
      return `
        <div class="repeat-item" data-type="direccion">
          <div class="repeat-item-header">
            <div class="repeat-item-title">Dirección #${index + 1}</div>
            <button type="button" class="btn btn-danger" onclick="removeItem(this)">Eliminar</button>
          </div>
          <div class="grid">
            <div class="col-3">
              <label>Tipo dirección</label>
              <select data-field="tipo_direccion">
                <option value="billing" ${tipo === 'billing' ? 'selected' : ''}>Billing</option>
                <option value="mail" ${tipo === 'mail' ? 'selected' : ''}>Mail</option>
                <option value="fiscal" ${tipo === 'fiscal' ? 'selected' : ''}>Fiscal</option>
                <option value="almacen" ${tipo === 'almacen' ? 'selected' : ''}>Almacén</option>
                <option value="patio" ${tipo === 'patio' ? 'selected' : ''}>Patio</option>
                <option value="entrega" ${tipo === 'entrega' ? 'selected' : ''}>Entrega</option>
                <option value="oficina" ${tipo === 'oficina' ? 'selected' : ''}>Oficina</option>
                <option value="otro" ${tipo === 'otro' ? 'selected' : ''}>Otro</option>
              </select>
            </div>
            <div class="col-3">
              <label>País</label>
              <input type="text" data-field="pais" value="${escapeHtml(data.pais || 'México')}" placeholder="México" />
            </div>
            <div class="col-3">
              <label>Predeterminada</label>
              <div class="check-pill" style="margin-top:0;">
                <input type="checkbox" data-field="es_direccion_predeterminada" ${data.es_direccion_predeterminada ? 'checked' : ''} />
                <span>Usar como principal del tipo</span>
              </div>
            </div>
            <div class="col-3">
              <label>Activa</label>
              <div class="check-pill" style="margin-top:0;">
                <input type="checkbox" data-field="activo" ${data.activo !== false ? 'checked' : ''} />
                <span>Dirección activa</span>
              </div>
            </div>

            <div class="col-6">
              <label>Calle y número</label>
              <input type="text" data-field="calle_y_numero" value="${escapeHtml(data.calle_y_numero || '')}" placeholder="Calle, número exterior" />
            </div>
            <div class="col-2">
              <label>No. interior</label>
              <input type="text" data-field="num_interior" value="${escapeHtml(data.num_interior || '')}" placeholder="Int. / Suite" />
            </div>
            <div class="col-4">
              <label>Colonia</label>
              <input type="text" data-field="colonia" value="${escapeHtml(data.colonia || '')}" placeholder="Colonia" />
            </div>

            <div class="col-2">
              <label>Código postal</label>
              <input type="text" data-field="codigo_postal" value="${escapeHtml(data.codigo_postal || '')}" placeholder="22800" />
            </div>
            <div class="col-3">
              <label>Ciudad</label>
              <input type="text" data-field="ciudad" value="${escapeHtml(data.ciudad || '')}" placeholder="Ensenada" />
            </div>
            <div class="col-3">
              <label>Municipio</label>
              <input type="text" data-field="municipio" value="${escapeHtml(data.municipio || '')}" placeholder="Ensenada" />
            </div>
            <div class="col-4">
              <label>Estado</label>
              <input type="text" data-field="estado" value="${escapeHtml(data.estado || '')}" placeholder="Baja California" />
            </div>

            <div class="col-6">
              <label>Google Maps Link</label>
              <input type="text" data-field="google_maps_link" value="${escapeHtml(data.google_maps_link || '')}" placeholder="https://maps.google.com/..." />
            </div>
            <div class="col-3">
              <label>Latitud</label>
              <input type="text" data-field="latitud" value="${escapeHtml(data.latitud || '')}" placeholder="31.8667421" />
            </div>
            <div class="col-3">
              <label>Longitud</label>
              <input type="text" data-field="longitud" value="${escapeHtml(data.longitud || '')}" placeholder="-116.5963716" />
            </div>

            <div class="col-12">
              <label>Referencias de llegada</label>
              <textarea data-field="referencias_llegada" placeholder="Portón azul, acceso por patio norte, etc.">${escapeHtml(data.referencias_llegada || '')}</textarea>
            </div>
          </div>
        </div>
      `;
    }

    function escapeHtml(value) {
      return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    }

    function removeItem(button) {
      const item = button.closest('.repeat-item');
      if (item) item.remove();
      refreshTitles();
      updatePreview();
    }

    window.removeItem = removeItem;

    function refreshTitles() {
      [...aliasesList.children].forEach((el, i) => {
        const t = el.querySelector('.repeat-item-title');
        if (t) t.textContent = `Alias #${i + 1}`;
      });
      [...contactosList.children].forEach((el, i) => {
        const t = el.querySelector('.repeat-item-title');
        if (t) t.textContent = `Contacto #${i + 1}`;
      });
      [...direccionesList.children].forEach((el, i) => {
        const t = el.querySelector('.repeat-item-title');
        if (t) t.textContent = `Dirección #${i + 1}`;
      });
    }

    function addAlias(data = {}) {
      aliasesList.insertAdjacentHTML('beforeend', aliasTemplate(aliasesList.children.length, data));
      updatePreview();
    }

    function addContacto(data = {}) {
      contactosList.insertAdjacentHTML('beforeend', contactoTemplate(contactosList.children.length, data));
      updatePreview();
    }

    function addDireccion(data = {}) {
      direccionesList.insertAdjacentHTML('beforeend', direccionTemplate(direccionesList.children.length, data));
      updatePreview();
    }

    function readRepeatItems(container) {
      return [...container.querySelectorAll('.repeat-item')].map(item => {
        const fields = [...item.querySelectorAll('[data-field]')];
        const obj = {};
        fields.forEach(field => {
          const key = field.dataset.field;
          if (field.type === 'checkbox') {
            obj[key] = field.checked;
          } else {
            obj[key] = cleanValue(field.value);
          }
        });
        return obj;
      });
    }

    function buildPayload() {
      const roles = [...document.querySelectorAll('#rolesGrid input[type="checkbox"]:checked')].map(cb => cb.value);

      const payload = {
        id: cleanValue(document.getElementById('id').value),
        entidad: {
          id: cleanValue(document.getElementById('id').value),
          codigo_interno: cleanValue(document.getElementById('codigo_interno').value),
          nombre_comercial: cleanValue(document.getElementById('nombre_comercial').value),
          razon_social: cleanValue(document.getElementById('razon_social').value),
          rfc: cleanValue(document.getElementById('rfc').value)?.toUpperCase() || null,
          tax_id_extranjero: cleanValue(document.getElementById('tax_id_extranjero').value),
          regimen_fiscal_id: cleanValue(document.getElementById('regimen_fiscal_id').value),
          tipo_persona: cleanValue(document.getElementById('tipo_persona').value),
          estatus: cleanValue(document.getElementById('estatus').value) || 'prospecto',
          habilitado_operaciones: document.getElementById('habilitado_operaciones').checked,
          habilitado_facturacion: document.getElementById('habilitado_facturacion').checked,
          habilitado_pagos: document.getElementById('habilitado_pagos').checked,
          activo: document.getElementById('activo').checked,
          bloqueado_motivo: cleanValue(document.getElementById('bloqueado_motivo').value),
          origen: cleanValue(document.getElementById('origen').value) || 'manual',
          notas: cleanValue(document.getElementById('notas').value)
        },
        roles,
        aliases: readRepeatItems(aliasesList).filter(a => a.alias_nombre),
        contactos: readRepeatItems(contactosList).filter(c => c.nombre_completo),
        direcciones: readRepeatItems(direccionesList).filter(d => d.calle_y_numero)
      };

      return payload;
    }

    function updatePreview() {
      const payload = buildPayload();
      const jsonPreview = document.getElementById('jsonPreview'); if (jsonPreview) jsonPreview.textContent = JSON.stringify(payload, null, 2);
      return payload;
    }

    async function submitPayload(payload) {
      const endpoint = 'https://n8n.bforward.cloud/webhook/0fff060f-8102-4a78-b520-53f212e354da';
      const method = 'POST';
    
      if (!payload.entidad.nombre_comercial) {
        showStatus('error', 'El campo Nombre comercial es obligatorio.');
        return;
      }
    
      try {
        showStatus('warn', 'Enviando información...');
    
        const res = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
    
        const data = await res.json();
    
        if (!res.ok) {
          showStatus('error', data.message || 'Ocurrió un error al guardar.');
          return;
        }
    
        showStatus('success', data.message || 'Información guardada correctamente.');
        console.log('Respuesta del webhook:', data);
    
      } catch (error) {
        console.error(error);
        showStatus('error', 'No fue posible conectar con el webhook.');
      }
    }

        const contentType = res.headers.get('content-type') || '';
        let responseData;
        if (contentType.includes('application/json')) {
          responseData = await res.json();
        } else {
          responseData = await res.text();
        }

        if (!res.ok) {
          throw new Error(typeof responseData === 'string' ? responseData : JSON.stringify(responseData));
        }

        showStatus('ok', `Entidad enviada correctamente. Respuesta: ${typeof responseData === 'string' ? responseData : JSON.stringify(responseData)}`);
      } catch (error) {
        showStatus('error', `Error al guardar: ${error.message}`);
      }
    }

    function resetForm() {
      form.reset();
      aliasesList.innerHTML = '';
      contactosList.innerHTML = '';
      direccionesList.innerHTML = '';
      addAlias();
      addContacto();
      addDireccion();
      clearStatus();
      updatePreview();
    }

    function loadDemo() {
      form.reset();
      aliasesList.innerHTML = '';
      contactosList.innerHTML = '';
      direccionesList.innerHTML = '';

      document.getElementById('codigo_interno').value = 'CLI-0001';
      document.getElementById('estatus').value = 'activo';
      document.getElementById('origen').value = 'manual';
      document.getElementById('nombre_comercial').value = 'Baja Forwarding';
      document.getElementById('razon_social').value = 'BAJA FORWARDING, S. DE R.L. DE C.V.';
      document.getElementById('rfc').value = 'BFO201127HY3';
      document.getElementById('regimen_fiscal_id').value = '601';
      document.getElementById('tipo_persona').value = 'moral';
      document.getElementById('habilitado_operaciones').checked = true;
      document.getElementById('habilitado_facturacion').checked = true;
      document.getElementById('habilitado_pagos').checked = true;
      document.getElementById('activo').checked = true;
      document.getElementById('notas').value = 'Cuenta demo para pruebas de portal.';

      [...document.querySelectorAll('#rolesGrid input[type="checkbox"]')].forEach(cb => {
        cb.checked = ['customer', 'shipper', 'consignee', 'vendor'].includes(cb.value);
      });

      addAlias({ alias_nombre: 'BFORWARD', alias_tipo: 'operativo' });
      addAlias({ alias_nombre: 'BAJA FORWARDING', alias_tipo: 'bl_name' });

      addContacto({
        nombre_completo: 'María López',
        puesto: 'Operaciones',
        area: 'Operaciones',
        email: 'operaciones@bforward.cloud',
        telefono_celular: '6461234567',
        telefono_oficina: '6460000000',
        extension: '101',
        whatsapp: '6461234567',
        idioma: 'es',
        es_contacto_operativo: true,
        es_contacto_facturacion: false,
        es_contacto_principal: true,
        recibe_notificaciones: true,
        activo: true,
        notas_contacto: 'Contacto principal de pruebas.'
      });

      addContacto({
        nombre_completo: 'Ana Pérez',
        puesto: 'Billing',
        area: 'Facturación',
        email: 'billing@bforward.cloud',
        idioma: 'es',
        es_contacto_operativo: false,
        es_contacto_facturacion: true,
        es_contacto_principal: false,
        recibe_notificaciones: true,
        activo: true
      });

      addDireccion({
        tipo_direccion: 'fiscal',
        es_direccion_predeterminada: true,
        calle_y_numero: 'Av. Blancarte 723',
        num_interior: 'Int. 3',
        colonia: 'Sección Primera',
        codigo_postal: '22800',
        ciudad: 'Ensenada',
        municipio: 'Ensenada',
        estado: 'Baja California',
        pais: 'México',
        google_maps_link: 'https://maps.google.com',
        referencias_llegada: 'Oficina principal demo.',
        latitud: '31.8667421',
        longitud: '-116.5963716',
        activo: true
      });

      updatePreview();
      clearStatus();
    }

    document.getElementById('btnAddAlias').addEventListener('click', () => addAlias());
    document.getElementById('btnAddContacto').addEventListener('click', () => addContacto());
    document.getElementById('btnAddDireccion').addEventListener('click', () => addDireccion());
    document.getElementById('btnPreview').addEventListener('click', updatePreview);
    document.getElementById('btnPreviewBottom').addEventListener('click', updatePreview);
    document.getElementById('btnLoadDemo').addEventListener('click', loadDemo);
    document.getElementById('btnReset').addEventListener('click', resetForm);

    form.addEventListener('input', updatePreview);
    form.addEventListener('change', updatePreview);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = updatePreview();
      await submitPayload(payload);
    });

    resetForm();
