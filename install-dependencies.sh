#!/bin/bash

echo "Installing PHP dependencies..."

# Check if composer is installed
if ! command -v composer &> /dev/null; then
    echo "Composer not found, installing..."
    
    # Download composer installer
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php -r "if (hash_file('sha384', 'composer-setup.php') === 'e21205b207c3ff031906575712edab6f13eb0b361f2085f1f1237b7126d785e826a450292b6cfd1d64d92e6563bbde02') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
    
    # Install composer locally
    php composer-setup.php
    php -r "unlink('composer-setup.php');"
    
    # Install dependencies
    php composer.phar install
else
    # Install dependencies using global composer
    composer install
fi

echo "PHP dependencies installed successfully!" 