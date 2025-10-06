### Ansible commands
- Encrypt vault
```
ansible-vault encrypt group_vars/all/vault.yml
```

- Edit encrypted vault file
```
ansible-vault edit group_vars/all/vault.yml
```

- Run a playbook with asking vault password
```
ansible-playbook -i inventory --ask-vault-pass playbook.yml
```

- Run a playbook with using vault password from a file
```
ansible-playbook -i inventory.ini --vault-password-file ./vault_password.txt playbook.yml
```
