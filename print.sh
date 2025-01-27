#!/bin/bash

# Définir le dossier de travail comme le répertoire courant
directory="."

# Fichier de sortie
output_file="./print_out.txt"

# Vider le fichier de sortie s'il existe déjà pour éviter une accumulation
> "$output_file"

# Trouver tous les fichiers en excluant node_modules, public, yarn.lock, .git, coverage, __tests__, et fichiers *.test.js
find "$directory" -type f \
    ! -path "./node_modules/*" \
    ! -path "./public/*" \
    ! -path "./.git/*" \
    ! -path "./coverage/*" \
    ! -path "./__tests__/*" \
    ! -name "*.test.js" \
    ! -name "yarn.lock" \
    ! -name ".gitignore" \
    ! -name "README.md" | while read -r file; do
    echo "==== $file ====" >> "$output_file"
    cat "$file" >> "$output_file"
    echo -e "\n" >> "$output_file"
done
