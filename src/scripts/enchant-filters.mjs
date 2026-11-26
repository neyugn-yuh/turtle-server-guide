/** Combine group and equipment filters in the single enchant catalog. */
export function initEnchantFilters() {
	for (const root of document.querySelectorAll('[data-re-root]')) {
		const groupSelect = root.querySelector('[data-re-group-select]');
		const targetSelect = root.querySelector('[data-re-target-select]');
		if (!groupSelect || !targetSelect) continue;
		const books = [...root.querySelectorAll('[data-re-book]')].map((element) => ({
			element,
			group: element.dataset.reGroup,
			targets: new Set(element.dataset.reTargets.split(' ')),
		}));
		const sections = [...root.querySelectorAll('[data-re-section]')];
		const status = root.querySelector('[data-re-status]');
		const empty = root.querySelector('[data-re-empty]');
		const reset = root.querySelector('[data-re-reset]');
		const total = Number(root.dataset.reTotal);
		const params = new URL(window.location.href).searchParams;
		for (const [select, key] of [[groupSelect, 'nhom'], [targetSelect, 'trang-bi']]) {
			const requested = params.get(key) ?? '';
			select.value = [...select.options].some((option) => option.value === requested) ? requested : '';
		}
		const matches = (book, group, target) => (!group || book.group === group) && (!target || book.targets.has(target));

		function bookAtHash() {
			try {
				const id = decodeURIComponent(window.location.hash.slice(1));
				return books.find((book) => book.element.id === id);
			} catch { return undefined; }
		}

		function apply(updateUrl) {
			const group = groupSelect.value;
			const target = targetSelect.value;
			const counts = new Map();
			let visible = 0;
			for (const book of books) {
				book.element.hidden = !matches(book, group, target);
				if (!book.element.hidden) {
					visible++;
					counts.set(book.group, (counts.get(book.group) ?? 0) + 1);
				}
			}
			for (const section of sections) {
				const count = counts.get(section.dataset.reGroupId) ?? 0;
				section.hidden = count === 0;
				section.querySelector('[data-re-section-count]').textContent = String(count);
			}
			// Each option counts matches for the other filter, making useful combinations clear.
			for (const option of groupSelect.options) {
				const count = books.filter((book) => matches(book, option.value, target)).length;
				option.textContent = `${option.dataset.reLabel} (${count})`;
			}
			for (const option of targetSelect.options) {
				const count = books.filter((book) => matches(book, group, option.value)).length;
				option.textContent = `${option.dataset.reLabel} (${count})`;
			}
			status.textContent = `Hiện ${visible} / ${total} sách`;
			empty.hidden = visible > 0;
			reset.hidden = !group && !target;
			if (updateUrl) {
				const url = new URL(window.location.href);
				for (const [key, value] of [['nhom', group], ['trang-bi', target]]) {
					if (value) url.searchParams.set(key, value);
					else url.searchParams.delete(key);
				}
				if (bookAtHash()?.element.hidden) url.hash = '';
				window.history.replaceState(window.history.state, '', url);
			}
		}

		// Search results and saved book anchors must remain reachable under an active filter.
		function revealHashTarget() {
			const book = bookAtHash();
			if (book?.element.hidden) {
				groupSelect.value = book.group;
				if (!book.targets.has(targetSelect.value)) targetSelect.value = '';
				apply(true);
				book.element.scrollIntoView({ block: 'start' });
			}
		}

		groupSelect.addEventListener('change', () => apply(true));
		targetSelect.addEventListener('change', () => apply(true));
		reset.addEventListener('click', () => {
			groupSelect.value = '';
			targetSelect.value = '';
			apply(true);
		});
		window.addEventListener('hashchange', revealHashTarget);
		root.querySelector('[data-re-controls]').hidden = false;
		apply(false);
		revealHashTarget();
	}
}
