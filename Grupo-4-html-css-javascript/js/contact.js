// =============================================JDL
// JAVASCRIPT PARA FUNCIONALIDAD DEL FORMULARIO DE CONTACTO
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const whatsappCheckbox = document.getElementById('whatsapp_contact');
    const telefonoField = document.getElementById('telefono');
    
    // Mostrar/ocultar campo de telefono segun checkbox
    whatsappCheckbox.addEventListener('change', function() {
        telefonoField.disabled = !this.checked;
        if (!this.checked) {
            telefonoField.value = '';
        }
    });
    
    // Inicialmente deshabilitar el campo de telefono
    telefonoField.disabled = true;
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validacion adicional si selecciono WhatsApp
            if (whatsappCheckbox.checked && !telefonoField.value.trim()) {
                alert('Por favor ingresa tu número de WhatsApp');
                return;
            }
            
            // Obtener datos del formulario
            const formData = {
                nombre: form.nombre.value.trim(),
                email: form.email.value.trim(),
                referencia: form.referencia.value,
                asunto: form.asunto.value.trim(),
                mensaje: form.mensaje.value.trim(),
                whatsapp_contact: whatsappCheckbox.checked,
                telefono: telefonoField.value.trim()
            };
            
            console.log('Datos a enviar:', formData);
            
            // Validacion basica
            if (!formData.nombre || !formData.email || !formData.referencia || 
                !formData.asunto || !formData.mensaje) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }
            
            // Validar email con regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Por favor ingresa un email válido');
                return;
            }
            
            // Validar longitud minima
            if (formData.nombre.length < 2) {
                alert('El nombre debe tener al menos 2 caracteres');
                return;
            }
            
            if (formData.mensaje.length < 10) {
                alert('El mensaje debe tener al menos 10 caracteres');
                return;
            }
            
            // Deshabilitar boton mientras se envia
            const submitBtn = form.querySelector('button[type="submit"]');
            const textoOriginal = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            try {
                // Enviar al servidor
                console.log('Enviando petición a /api/contact');
                
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                console.log('Respuesta del servidor:', response.status);
                
                const result = await response.json();
                console.log('Datos de respuesta:', result);
                
                if (result.success) {
                    alert('¡Mensaje enviado con éxito! Te contactaremos pronto.');
                    form.reset();
                    telefonoField.disabled = true;
                } else {
                    alert('Error: ' + result.message);
                }
                
            } catch (error) {
                console.error('Error completo:', error);
                alert('Error al enviar el mensaje. Verifica que el servidor esté corriendo.');
            } finally {
                // Restaurar boton
                submitBtn.textContent = textoOriginal;
                submitBtn.disabled = false;
            }
        });
    }
});