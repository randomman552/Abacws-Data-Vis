FROM debian

ADD data.sh crontab /
RUN \
    apt-get update && \
    apt-get install -y cron docker.io --no-install-recommends --no-install-suggests && \
    apt clean && \
    rm -rf /var/lib/apt/lists/* && \
    crontab /crontab

CMD [ "cron", "-f" ]