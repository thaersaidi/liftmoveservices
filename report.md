## Top 5 des résultats et plan d'amélioration

### Élément 1
**Pilier :** Fiabilité
**Gravité :** Critique
**Constatation :** L'utilisation de TLS 1.0 pour le chiffrement des données est obsolète et présente des risques de sécurité importants en raison de vulnérabilités connues.
**Amélioration :** Mettre à niveau tous les comptes vers au moins TLS 1.2 pour garantir une transmission sécurisée des données et améliorer l'interopérabilité entre tous les services

### Élément 2
**Pilier :** Excellence opérationnelle
**Gravité :** Moyenne
**Constatation :** Les pratiques d'automatisation obsolètes, qui utilisent actuellement les machines virtuelles Start/Stop v1 obsolètes, limitent l'optimisation des processus de déploiement et de maintenance.
**Amélioration :** Effectuez une mise à niveau vers Start/Stop VMs v2 et implémentez l'infrastructure en tant que code (IaC) à l'aide de modèles Azure Resource Manager ou de Terraform pour des déploiements cohérents

### Élément 3
**Pilier :** Sécurité
**Gravité :** Élevée
**Constat :** L'absence de chiffrement des données au repos et en transit, ainsi qu'une protection inadéquate des points de terminaison, constituent un risque pour la sécurité des données sensibles.
**Amélioration :** Activez le chiffrement des données au repos et en transit, et activez les fonctionnalités de sécurité avancées et la protection des points de terminaison pour vous protéger contre les accès non autorisés

### Élément 4
**Pilier :** Optimisation des coûts
**Gravité :** Élevée
**Constat :** L'absence de processus d'audit réguliers pour identifier et supprimer les ressources inutilisées entraîne des dépenses inutiles.
**Amélioration :** implémentez un processus d'audit régulier pour identifier et supprimer les ressources inutilisées, configurez le renouvellement automatique des réservations expirées et envisagez les instances de machines virtuelles réservées pour économiser sur les coûts à la demande

### Élément 5
**Pilier :** Fiabilité
**Gravité :** Élevée
**Constat :** Les politiques de sauvegarde et les périodes de conservation ne sont pas optimisées, ce qui risque de provoquer une perte de données en cas de panne ou de panne.
**Amélioration :** Vérifiez et optimisez les politiques de sauvegarde et les périodes de conservation en fonction des besoins de récupération et des considérations de coût, et configurez Azure Backup pour les machines virtuelles afin de garantir la protection des données et une récupération rapide
,[object Object],