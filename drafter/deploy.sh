ssh server -T <<'EOL'
	cd rankings/drafter && \
	git fetch && git reset --hard origin/fresh-sheets && \
	docker compose up --build -d
EOL