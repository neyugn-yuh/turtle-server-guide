/*
 * Detail box for the menu pictures (markup from src/plugins/gui-menus.mjs, styles in src/styles/gui.css).
 *
 * Mouse: hovering a slot opens the box. Keyboard: focusing a slot opens it. Touch: tapping a slot opens it, tapping it
 * again or anywhere else closes it. Every slot of the same group (same `data-g`) is lit together.
 * The text of the box is the hidden `.gui-src` inside the slot; without this script the picture is still readable
 * because every slot also carries its text in `aria-label`.
 */
(function () {
	'use strict';

	function init(panel) {
		var tip = document.createElement('div');
		tip.className = 'gui-tip';
		tip.setAttribute('aria-hidden', 'true');
		panel.appendChild(tip);

		var slots = Array.prototype.slice.call(panel.querySelectorAll('.gui-hit'));
		var current = null;
		var pointer = 'mouse';

		function mates(slot) {
			if (!slot.dataset.g) return [slot];
			return slots.filter(function (other) {
				return other.dataset.g === slot.dataset.g;
			});
		}

		function place(slot) {
			var p = panel.getBoundingClientRect();
			var s = slot.getBoundingClientRect();
			tip.style.left = '0px';
			tip.style.top = '0px';
			var width = tip.offsetWidth;
			var height = tip.offsetHeight;
			var left = s.left - p.left + s.width / 2 - width / 2;
			left = Math.max(0, Math.min(left, p.width - width));
			var below = s.bottom - p.top + 8;
			var above = s.top - p.top - height - 8;
			// Lower half of the picture: open upwards when it fits, otherwise downwards.
			var top = s.top - p.top > p.height / 2 && above >= 0 ? above : below;
			tip.style.left = Math.round(left) + 'px';
			tip.style.top = Math.round(top) + 'px';
		}

		function hide() {
			if (!current) return;
			slots.forEach(function (s) {
				s.classList.remove('is-on', 'is-mate');
			});
			tip.classList.remove('is-open');
			current = null;
		}

		function show(slot) {
			if (current === slot) return;
			hide();
			var source = slot.querySelector('.gui-src');
			if (!source) return;
			current = slot;
			mates(slot).forEach(function (s) {
				s.classList.add(s === slot ? 'is-on' : 'is-mate');
			});
			tip.replaceChildren.apply(tip, Array.prototype.slice.call(source.cloneNode(true).childNodes));
			place(slot);
			tip.classList.add('is-open');
		}

		slots.forEach(function (slot) {
			slot.addEventListener('pointerdown', function (event) {
				pointer = event.pointerType || 'mouse';
			});
			slot.addEventListener('pointerenter', function (event) {
				if (event.pointerType !== 'touch') show(slot);
			});
			slot.addEventListener('pointerleave', function (event) {
				if (event.pointerType !== 'touch') hide();
			});
			slot.addEventListener('focus', function () {
				if (slot.matches(':focus-visible')) show(slot);
			});
			slot.addEventListener('blur', hide);
			slot.addEventListener('click', function () {
				if (pointer !== 'touch') return;
				if (current === slot) hide();
				else show(slot);
			});
		});

		document.addEventListener('pointerdown', function (event) {
			if (current && !(event.target instanceof Element && event.target.closest('.gui-hit') && panel.contains(event.target))) hide();
		});
		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape') hide();
		});
		window.addEventListener('resize', hide);
	}

	function start() {
		Array.prototype.forEach.call(document.querySelectorAll('.gui-panel'), init);
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
	else start();
})();
